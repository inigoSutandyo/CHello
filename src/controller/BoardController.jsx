import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, Timestamp, updateDoc, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { createNewBoard } from "../factory/BoardFactory"
import { db } from "../util/FireBaseConfig"
import { addTemplateList } from "./KanbanController"
import { addBoard, removeBoard } from "./WorkspaceController"


const checkMembership = (data, userRef) => {
    const isAdmin = data.admins.find((admin) => {
        return admin.id === userRef.id
    })
    const isMember = data.members.find((member) => {
        return member.id === userRef.id
    })

    return isAdmin ? "admin" : isMember ? "member" : "none"
}

export const useBoards = (userId, workspace, updater) => {
    const [boards, setBoards] = useState(null)
    useEffect(() => {
        if (userId == null || workspace == null) {
            return
        }
        const loadQuery = async () => {
            try {
                const boardRef = []
                if (workspace != null) {
                   
                    workspace.boards.forEach(doc => {
                        boardRef.push(doc.id)
                        // console.log(doc.id)
                    });
                }
                if (boardRef.length <= 0) {
                    setBoards(boardRef)
                    return
                } 
                const docRef = doc(db.getDB(),'users',userId)
                // , where('uid','in',boardRef)
                const q = query(collection(db.getDB(), "boards"))
                const querySnapshot = await getDocs(q)

                if (querySnapshot) {
                    const documents = []
                    querySnapshot.forEach(element => {
                        const member = checkMembership(element.data(),docRef)
                        if (boardRef.indexOf(element.id) != -1) {
                            documents.push({
                                ...element.data(),
                                curr_membership: member
                            })
                            
                        }
                    });

                    setBoards(documents)
                }
                
            } catch (e) {
                console.log(e)
            }
        }
        loadQuery()
    }, [updater])
    // console.log(boards)
    return boards;
}


export const addNewBoard = async (e) => {
    console.log("Adding Board")
    e.preventDefault()

    const title = e.target.elements.boardTitle.value.trim()

    if (!title) {
        return ""
    }
    const workSpaceId = e.target.elements.workSpaceId.value
    const userId = e.target.elements.userId.value

    const newBoard = createNewBoard(title, Timestamp.now()).toDictionary()
    const boardRef = await addDoc(collection(db.getDB(), "boards"), newBoard);
    await addListInBoard(boardRef.id)
    await addAdminBoard(boardRef.id,userId);
    await addBoard(workSpaceId, boardRef);

    e.target.elements.boardTitle.value = ""
    console.log("done adding")
    return ""
}

export const closeBoard = async (boardId, workSpaceId) => {
    console.log("Closing")
    const boardRef = doc(db.getDB(), 'boards', boardId)

    await removeBoard(workSpaceId,boardRef)
    await updateDoc(boardRef, {
        closed: true
    })
    return ""
}

export const userLeaveBoard = async (userId, boardId, workspaceId, membership) => {
    console.log("Leaving Board");

    const boardRef = await removeUser(userId, boardId, membership)
    const boardSnap = await getDoc(boardRef)
    if (boardSnap.exists()) {
        if (boardSnap.data().admins.length === 0 && boardSnap.data().members.length === 0 ) {
            deleteBoard(boardId,workspaceId)
        }
    }
}

const removeUser = async (userId, boardId, membership) => {
    const userRef = doc(db.getDB(), 'users', userId)
    
    if (membership == "member") {
        return await updateDoc(doc(db.getDB(), 'boards', boardId), {
            members: arrayRemove(userRef)
        })
    } else {
        return await updateDoc(doc(db.getDB(), 'boards', boardId), {
            admins: arrayRemove(userRef)
        })
    }
}

// delete permanent
export const deleteBoard = async (boardId, workSpaceId) => {
    console.log("Deleting")
    const boardRef = doc(db.getDB(), 'boards', boardId)

    if (workSpaceId) await removeBoard(workSpaceId,boardRef)
    
    await deleteDoc(boardRef)
    return ""
}

export const useBoardById = (boardId, userId, boardUpdater) => {
    const [board, setBoard] = useState(null)
    
    useEffect(() => {
        if (!userId) return

        const loadAsync = async () => {
            const userRef = doc(db.getDB(), 'users', userId)
            const docRef = doc(db.getDB(), 'boards', boardId)
            const docSnap = await getDoc(docRef)
            
            if (docSnap.exists()) {
                const data = docSnap.data()
                const membership = checkMembership(data, userRef)
                setBoard({
                    ...docSnap.data(),
                    curr_membership: membership
                })
            }
        }
        loadAsync()
    }, [boardId, userId, boardUpdater]);

    return board
}

export const addAdminBoard = async (boardId, userId) => {
    const docRef = doc(db.getDB(),'users',userId)
    const boardRef = doc(db.getDB(),'boards',boardId)
    await updateDoc(boardRef, {
        uid: boardRef.id,
        admins: arrayUnion(docRef)
    })
}

export const joinBoard = async (boardId, userId) => {
    const docRef = doc(db.getDB(),'users',userId)
    const boardRef = doc(db.getDB(),'boards',boardId)
    await updateDoc(boardRef, {
        members: arrayUnion(docRef)
    })
}
export const addListInBoard = async (boardId) => {
    addTemplateList(boardId).then(async (listRef) => {
        await updateDoc(listRef, {
            uid: listRef.id
        })
    })
}

export const removeBoardUser = async (boardId, userId) => {
    const boardRef = doc(db.getDB(), 'boards', boardId)
    const boardSnap = await getDoc(boardRef)
    if (boardSnap.exists()) {
        const data = boardSnap.data()
        const userRef = doc(db.getDB(), 'users', userId)
        const membership = checkMembership(data, userRef)
        if (membership == "admin") {
            await updateDoc(boardRef, {
                admins: arrayRemove(userRef)
            })
        } else if (membership == "member") {
            await updateDoc(boardRef, {
                members: arrayRemove(userRef)
            })
        }
    }
}

export const changeMembershipBoard = async (boardId, userId) => {
  const userRef = doc(db.getDB(), "users", userId)
  const boardRef = doc(db.getDB(), "boards", boardId)
  const boardSnap = await getDoc(boardRef)
  if (boardSnap.exists()) {
    const data = boardSnap.data()

    const membership = checkMembership(data, userRef)
    // console.log(isAdmin)
    if (membership === "admin") {
      toMember(userRef, boardRef)
    } else if (membership ==="member") {
      toAdmin(userRef, boardRef)
    }
  }
}

const toMember = async (userRef, boardRef) => {
    await updateDoc(boardRef, {
      admins: arrayRemove(userRef),
      members: arrayUnion(userRef)
    })
}
  
const toAdmin = async (userRef, boardRef) => {
    await updateDoc(boardRef, {
        admins: arrayUnion(userRef),
        members: arrayRemove(userRef)
    })
} 

export const useBoardUsers = (board) => {
    const [admins, setAdmins] = useState([]) 
    const [members, setMembers] = useState([]) 
  
    // const [loading, setLoading] = useState(false)
    useEffect(() => {
      if (board == null) {
        return;
      }
  
      const loadData = async () => {
        const adminRefs = [];
        const memberRefs = [];
        const adminList = [];
        const memberList = [];
  
        try {
          if (board.admins) {
            board.admins.forEach((admin) => {
              adminRefs.push(admin.id);
            });
          }
          if (board.members) {
            board.members.forEach((member) => {
              memberRefs.push(member.id);
            });
          }
  
          const querySnapshot = await getDocs(collection(db.getDB(), "users"));
          if (querySnapshot) {
            querySnapshot.forEach((doc) => {
              if (adminRefs.indexOf(doc.id) != -1) {
                adminList.push({
                  uid: doc.id,
                  role: "admin",
                  ...doc.data(),
                });
              } else if (memberRefs.indexOf(doc.id) != -1) {
                memberList.push({
                  uid: doc.id,
                  role: "member",
                  ...doc.data(),
                });
              } 
            });
          }
          setAdmins(adminList);
          setMembers(memberList);
  
        } catch (error) {
          console.log(error);
        }
      };
      loadData();
    }, [board]);
  
    // console.log(admins);
    return { admins, members };
};

export const changeVisibilityBoard = async (boardId, visibility) => {
    await updateDoc(doc(db.getDB(), 'boards', boardId), {
        visibility: visibility
    })
}

export const moveBoard = async (boardId, fromId, toId) => {
    const boardRef = doc(db.getDB(), 'boards', boardId)
    
    await updateDoc(doc(db.getDB(), 'workspaces', fromId), {
        boards: arrayRemove(boardRef)
    })
    await updateDoc(doc(db.getDB(), 'workspaces', toId), {
        boards: arrayUnion(boardRef)
    })
}

export const openBoard = async (boardId, workspaceId) => {
    const boardRef = doc(db.getDB(), 'boards', boardId)
    await updateDoc(boardRef, {
        closed: false
    })
    await updateDoc(doc(db.getDB(), 'workspaces', workspaceId), {
        boards: arrayUnion(boardRef)
    })
}

export const useAllBoards = (userId, workspaces, search) => {
    const [boards, setBoards] = useState(null)
    const [closed, setClosed] = useState(null)

    const [fixedOpen, setFixedOpen] = useState(null)
    const [fixedClosed, setFixedClosed] = useState(null)

    useEffect(() => {
        if (!userId) return
        const boardList = []
        const closedList = []
        const userRef = doc(db.getDB(), 'users', userId)
        const loadData = async () => {
            const boardSnap = await getDocs(collection(db.getDB(), 'boards'))
            if (boardSnap) {
                boardSnap.forEach(board => {
                    const data = board.data()
    
                    const membership = checkMembership(data, userRef)
                    if (membership !== "none" && data.closed === false) {
                        boardList.push({
                            uid: board.id,
                            curr_membership: membership,
                            ...data
                        })
                    } else if (data.closed === true && membership === "admin") {
                        closedList.push({
                            uid: board.id,
                            curr_membership: membership,
                            ...data
                        })
                    }
                });
            }
            setBoards(boardList)
            setClosed(closedList)
            setFixedOpen(boardList)
            setFixedClosed(closedList)
        }
        loadData()
    }, [userId, workspaces])

    useEffect(() => {
        if (boards) {
            const openResult = fixedOpen.filter(item => {
                const term = search.toLowerCase()
                return item.title.toLowerCase().startsWith(term)
            })
            setBoards(openResult)
        }

        if (closed) {
            const closedResult = fixedClosed.filter(item => {
                const term = search.toLowerCase()
                return item.title.toLowerCase().startsWith(term)
            })
            setClosed(closedResult)
        }
    }, [search])
    

    return {openBoards: boards, closedBoards: closed}
}


export const useFavoriteBoards = (userId, updater) => {
    const [boards, setBoards] = useState(null)

    useEffect(() => {
      if (!userId) return
      const boardList = []
      const loadData = async () => {
        const userRef = doc(db.getDB(), 'users', userId)
        const userSnap = await getDoc(userRef)
        if (userSnap) {
            const favorites = userSnap.data().favorites
            if (favorites && favorites.length > 0) {
                const boardSnap = await getDocs(collection(db.getDB(), 'boards'))
                if (boardSnap) {
                    boardSnap.forEach(doc => {
                        if (favorites.indexOf(doc.id) !== -1) {
                            const data = doc.data()
                            const membership = checkMembership(data, userRef)
                            boardList.push({
                                uid: doc.id,
                                curr_membership: membership,
                                ...data
                            })
                        }
                    });
                }
            }
            setBoards(boardList)
        }
      }
      loadData()
    }, [userId, updater])
    return boards
}

export const changeFavorites = async (isFav, userId, boardId) => {
    console.log(isFav)
    if (isFav) {
        await updateDoc(doc(db.getDB(), 'users', userId), {
            favorites: arrayUnion(boardId)
        })        
    } else {
        await updateDoc(doc(db.getDB(), 'users', userId), {
            favorites: arrayRemove(boardId)
        }) 
    }
}
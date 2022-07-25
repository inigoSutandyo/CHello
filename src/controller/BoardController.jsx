import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, Timestamp, updateDoc, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../util/FireBaseConfig"
import { addTemplateList } from "./KanbanController"
import { addBoard, removeBoard } from "./WorkspaceController"

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
                const q = query(collection(db.getDB(), "boards"), where('admins', "array-contains", docRef))
                const querySnapshot = await getDocs(q)

                if (querySnapshot) {
                    const documents = []
                    querySnapshot.forEach(element => {
                        if (boardRef.indexOf(element.id) != -1) {
                            documents.push({
                                ...element.data()
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

    const boardRef = await addDoc(collection(db.getDB(), "boards"), {
        title: title,
        datecreated: Timestamp.now(),
        admins: [],
        members: []
    });
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

// delete permanent
export const deleteBoard = async (boardId, workSpaceId) => {
    console.log("Deleting")
    const boardRef = doc(db.getDB(), 'boards', boardId)

    await removeBoard(workSpaceId,boardRef)
    await deleteDoc(boardRef)
    return ""
}

export const useBoardById = (boardId) => {
    const [board, setBoard] = useState(null)
    
    useEffect(() => {
        const loadAsync = async () => {
            const docRef = doc(db.getDB(), 'boards', boardId)
            const docSnap = await getDoc(docRef)
            
            if (docSnap.exists()) {
                setBoard(docSnap.data())
            }
        }
        loadAsync()
    }, [boardId]);
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
export const addListInBoard = async (boardId) => {
    addTemplateList(boardId).then(async (listRef) => {
        await updateDoc(listRef, {
            uid: listRef.id
        })
    })
}
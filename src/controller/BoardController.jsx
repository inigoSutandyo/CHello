import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, Timestamp, updateDoc, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../util/FireBaseConfig"

export const useBoards = (userId, workspace) => {
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
                    });
                }
                if (boardRef.length <= 0) {
                    setBoards(boardRef)
                    return
                } 
                const docRef = doc(db,'users',userId)
                // , where('uid','in',boardRef)
                const q = query(collection(db, "boards"), where('admins', "array-contains", docRef), where('uid','in',boardRef))
                const querySnapshot = await getDocs(q)

                if (querySnapshot) {
                    const documents = []
                    querySnapshot.forEach(element => {
                        console.log(querySnapshot)
                        documents.push({
                            ...element.data()
                        })
                    });
    
                    setBoards(documents)
                }
                
            } catch (e) {
                console.log(e)
            }
        }
        loadQuery()
    }, [workspace])
    return boards;
}


export const addNewBoard = async (e) => {
    console.log("Adding")
    e.preventDefault()

    const title = e.target.elements.listTitle.value
    const boardId = e.target.elements.boardId.value


    const boardRef = await addDoc(collection(db, "boards"), {
        title: title,
        datecreated: Timestamp.now(),
        admins: [],
        members: []
    });
    
    const listRef = await addDoc(collection(db, `boards/${boardRef.id}/lists`), {
        title: "TO DO",
        datecreated: Timestamp.now()
    })

    console.log(boardRef)

    await updateDoc(boardRef, {
        uid: boardRef.id
    })

    await updateDoc(listRef, {
        uid: listRef.id
    })
    
    const workspaceRef = doc(db, "workspace", boardId)
    await updateDoc(workspaceRef, {
        boards: arrayUnion(boardRef)
    })
    e.target.elements.boardTitle.value = ""
    window.location.reload()
}

// delete permanent
export const deleteBoard = async (boardId, workSpaceId) => {
    console.log("Deleting")
    const boardRef = doc(db, 'boards', boardId)
    const workspaceRef = doc(db, "workspaces", workSpaceId)

    await updateDoc(workspaceRef, {
        boards: arrayRemove(boardRef)
    }).then(async () => {
        await deleteDoc(boardRef)
    })
    window.location.reload()
}

export const useBoardById = (boardId) => {
    const [board, setBoard] = useState(null)
    
    useEffect(() => {
        const loadAsync = async () => {
            const docRef = doc(db, 'boards', boardId)
            const docSnap = await getDoc(docRef)
            
            if (docSnap.exists()) {
                setBoard(docSnap.data())
            }
        }
        loadAsync()
    }, [boardId]);
    return board
}


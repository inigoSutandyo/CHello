import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, query, Timestamp, updateDoc } from "firebase/firestore"
import { useEffect } from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { db } from "../util/FireBaseConfig"


export const useKanban = (board, updater) => {
    const [lists, setLists] = useState(null)

    useEffect(() => {
        if (board == null) {
            return;
        }

        const loadData = async () => {
            const listArr = []
            const q = query(collection(db.getDB(), `boards/${board.uid}/lists`))
            const querySnapshot = await getDocs(q)
            if (querySnapshot) {
                querySnapshot.forEach((doc) => {
                    // console.log(doc.data())
                    listArr.push({
                        uid: doc.id,
                        ...doc.data()
                    })
                })
                setLists(listArr)
            }
        }
        
        loadData()
        return () => {
            setLists(null)
        }
    }, [updater])

    // console.log(lists)
    return lists
}

export const addNewList = async (e) => {  
    e.preventDefault()

    const title = e.target.elements.listTitle.value
    const boardId = e.target.elements.boardId.value
    
    await addDoc(collection(db.getDB(), `/boards/${boardId}/lists`), {
        title: title,
        datecreated: Timestamp.now()
    })

    return ""
}

export const addTemplateList = async (boardId) => {
    const listRef = await addDoc(collection(db.getDB(), `boards/${boardId}/lists`), {
        title: "TO DO",
        datecreated: Timestamp.now()
    })

    return listRef
}

export const updateTitleList = async (title, listId, boardId) => {
    if (!title) {
        return
    }
    await updateDoc(doc(db.getDB(), `boards/${boardId}/lists`,listId), {
        title: title
    })
}
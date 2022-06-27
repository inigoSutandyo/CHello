import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, query, Timestamp, updateDoc } from "firebase/firestore"
import { useEffect } from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { db } from "../util/FireBaseConfig"


export const useKanban = (board) => {
    const [lists, setLists] = useState(null)

    useEffect(() => {
        if (board == null) {
            return;
        }

        const loadData = async () => {
            const listArr = []
            const q = query(collection(db, `boards/${board.uid}/lists`))
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
    }, [board])

    // console.log(lists)
    return lists
}

export const addNewList = async (e) => {  
    e.preventDefault()

    const title = e.target.elements.listTitle.value
    const boardId = e.target.elements.boardId.value
    

    // const boardRef = doc(db, 'boards',boardId);

    addDoc(collection(db, `/boards/${boardId}/lists`), {
        title: title,
        datecreated: Timestamp.now()
    }).then(async (docRef) => {
        await updateDoc(docRef, {
            uid: docRef.id
        })
        window.location.reload()
    })

    
}
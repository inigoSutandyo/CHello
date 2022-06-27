import { addDoc, collection, getDocs, query, Timestamp, updateDoc } from "firebase/firestore"
import { useEffect } from "react"
import { useState } from "react"
import { db } from "../util/FireBaseConfig"


export const useCards = (kanban, board) => {
    const [cards, setCards] = useState(null)

    useEffect(() => {
        if (kanban == null) {
            return;
        }
        if (board == null) {
            return;
        }

        const loadData = async () => {
            const cardArr = []
            const q = query(collection(db, `boards/${board.uid}/lists/${kanban.uid}/cards`))
            const querySnapshot = await getDocs(q)
            if (querySnapshot) {
                querySnapshot.forEach((doc) => {
                    // console.log(doc.data())
                    cardArr.push(doc.data())
                })
                setCards(cardArr)
            }
        }
        loadData()
    }, [kanban])
    // console.log(cards)
    return cards
}

export const addNewCard = async (e) => {  
    e.preventDefault()

    const title = e.target.elements.cardTitle.value
    const boardId = e.target.elements.boardId.value
    const listId = e.target.elements.listId.value

    // const boardRef = doc(db, 'boards',boardId);

    const docRef = await addDoc(collection(db, `/boards/${boardId}/lists/${listId}/cards`), {
        title: title,
        description: "This is a description",
        datecreated: Timestamp.now()
    })
    // console.log(docRef.path)
    await updateDoc(docRef, {
        uid: docRef.id
    })
    
    window.location.reload()
}
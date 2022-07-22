import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, query, Timestamp, updateDoc } from "firebase/firestore"
import { useEffect } from "react"
import { useState } from "react"
import { db } from "../util/FireBaseConfig"


export const useCards = (kanbanId, board, cardUpdater) => {
    const [cards, setCards] = useState(null)

    useEffect(() => {
        if (!kanbanId || !board) {
            return;
        }

        const loadData = async () => {

            const docSnap = await getDoc(doc(db, `boards/${board.uid}/lists`, kanbanId))
            if (!docSnap.data().cards) {
                return
            }
            const refList = []
            docSnap.data().cards.forEach((ref) => {
                refList.push(ref.id)
            })
            const cardArr = []
            const q = query(collection(db, `boards/${board.uid}/cards`))
            const querySnapshot = await getDocs(q)

            if (querySnapshot) {
                querySnapshot.forEach((doc) => {                    
                    if (refList.indexOf(doc.id) != -1) {
                        cardArr.push({
                            uid: doc.id,
                            ...doc.data()
                        })
                        
                        // console.log(doc.data())
                    }
                })
                setCards(cardArr)
            }
        }
        loadData()
    }, [cardUpdater])
    // console.log(cards)
    return cards
}

export const addNewCard = async (e) => {  
    e.preventDefault()

    const title = e.target.elements.cardTitle.value
    const boardId = e.target.elements.boardId.value
    const listId = e.target.elements.listId.value

    // const boardRef = doc(db, 'boards',boardId);

    const docRef = await addDoc(collection(db, `/boards/${boardId}/cards`), {
        title: title,
        description: "This is a description",
        datecreated: Timestamp.now()
    })
    // console.log(docRef.path)
    await updateDoc(doc(db, `/boards/${boardId}/lists`, listId), {
        cards: arrayUnion(docRef)
    })

    return ""
}

export const updateDescription = async (desc, cardId, boardId) => {
    await updateDoc(doc(db,`boards/${boardId}/cards/`, cardId), {
        description: desc
    })
}
export const updateTitle = async (title, cardId, boardId) => {
    await updateDoc(doc(db,`boards/${boardId}/cards/`, cardId), {
        title: title
    })
}

export const addCheckList = async (cardId, boardId, content) => {
    // console.log(cardId)
    // console.log(boardId)
    // console.log(content)
    if (!content || !boardId || !cardId) {
        console.log("error")
        return
    }
    await addDoc(collection(db,`boards/${boardId}/cards/${cardId}/checklists`), {
        content: content,
        isChecked: false,
    })
    
}

export const removeCheckList = async (cardId, boardId, listId) => {
    const checkRef = doc(db,`boards/${boardId}/cards/${cardId}/checklists`, listId)
    
    await deleteDoc(checkRef)
}

export const useCheckList = (card, boardId) => {
    const [checklist, setChecklist] = useState(null)
    
    
    useEffect(() => {
        if (!card ) {
            return
        }
        
        const checkArr = []
        const loadData = async () => {
            try {
                
                const q = query(collection(db,`boards/${boardId}/cards/${card.uid}/checklists`))
                const querySnapshot = await getDocs(q)
                if (querySnapshot) {
                    querySnapshot.forEach((doc) => {
                        checkArr.push({
                            uid: doc.id,
                            ...doc.data()
                        })
                    })
                }
                setChecklist(checkArr)
            } catch (error) {
                console.log(error)
            }
        }
        loadData()
    }, [card])
    // console.log(checklist)
    return checklist
}
import { addDoc, arrayRemove, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, Timestamp, updateDoc } from "firebase/firestore"
import { list } from "firebase/storage"
import { useEffect } from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { db } from "../util/FireBaseConfig"


export const useKanban = (board, updater, search, position, cardPosition) => {
    const [lists, setLists] = useState(null)
    const [fixed, setFixed] = useState(null)
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
                setFixed(listArr)
            }
        }
        
        loadData()
        return () => {
            setLists(null)
        }
    }, [updater])

    useEffect(() => {

        if (lists !== null) {
            const result = fixed.filter(item => {
                const term = search.toLowerCase()
                return item.title.toLowerCase().startsWith(term)
            })
            // console.log(result)
            setLists(result)
        }
    }, [search])

    useEffect(() => {
      if (position.destination === position.source) return
      const dest = position.destination
      const src = position.source

      if (lists !== null) {
        const arr = []
        lists.forEach(d => {
            arr.push(d)
        });
        const temp = arr[dest]
        arr[dest] = arr[src] 
        arr[src] = temp
        setLists(arr)
      }
       
    }, [position])
    
    useEffect(() => {
        if (lists === null) return
        const arr = []
        let srcId = ""
        let dstId = ""
        for (let i = 0; i < lists.length; i++) {
            const element = lists[i];
            if (i === cardPosition.destinationCard) {
                dstId = element.uid
            }

            if (i === cardPosition.sourceCard) {
                srcId = element.uid
            }
            arr.push(element)
        }
        if (cardPosition.sameList) {
            const dest = cardPosition.destinationCard
            const src = cardPosition.sourceCard
            const cards = arr[cardPosition.sourceList].cards
            const temp = cards[dest]
            cards[dest] = cards[src] 
            cards[src] = temp
            // console.log(cards)
            // const updatePosition = async () => {
            //     await updateDoc(doc(db.getDB(), `boards/${board.uid}/lists`, srcId), {
            //         cards: cards
            //     })
            // }
            // updatePosition()
            arr[cardPosition.sourceList].cards = cards
            setLists(arr)
            
        }
    }, [cardPosition])

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

export const removeCardFromList = async (cardRef, listId, boardId) => {
    await updateDoc(doc(db.getDB(), `boards/${boardId}/lists`, listId), {
        cards: arrayRemove(cardRef)
    })
}

export const deleteList = async (listId, boardId) => {
    await deleteDoc(doc(db.getDB(), `boards/${boardId}/lists`, listId))
}
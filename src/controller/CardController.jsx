import { collection, getDocs } from "firebase/firestore"
import { useEffect } from "react"
import { useState } from "react"
import { db } from "../util/FireBaseConfig"


export const useCards = (kanban) => {
    const [cards, setCards] = useState(null)

    useEffect(() => {
        if (kanban == null) {
            return;
        }
        const loadData = async () => {
            const cardRefs = []
            try {
                kanban.cardlist.forEach((card) => {
                    cardRefs.push(card.id)
                });
            } catch (error) {
                console.log(error)
            }
            if (cardRefs.length === 0) {
                setCards([])
                return;
            }

            const cardArr = []
            await getDocs(collection(db, 'cards')).then((docs) => {
                docs.forEach((doc) => {
                    if (cardRefs.includes(doc.data().uid)) {
                        cardArr.push(doc.data())
                    }
                })
            })

            setCards(cardArr)
        }
        loadData()
    }, [kanban])
    console.log(cards)
    return cards
}
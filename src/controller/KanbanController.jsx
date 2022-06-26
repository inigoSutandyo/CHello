import { collection, getDocs } from "firebase/firestore"
import { useEffect } from "react"
import { useState } from "react"
import { db } from "../util/FireBaseConfig"

export const useKanban = (board) => {
    const [lists, setLists] = useState(null)

    useEffect(() => {
      
      if (board == null) {
        return;
      }
      const loadData = async () => {
        const listRefs = []
        try {
            board.lists.forEach((list) => {
                listRefs.push(list.id)
            });
        } catch (error) {
            console.log(error)
        }
        if (listRefs.length === 0) {
            return;
        }

        const listArr = []
        await getDocs(collection(db, 'lists')).then((docs) => {
            docs.forEach((doc) => {
                if (listRefs.includes(doc.data().uid)) {
                    listArr.push(doc.data())
                }
            })
        })

        setLists(listArr)
      }
      loadData()
    //   const listRef = []

    }, [board])

    return lists
}
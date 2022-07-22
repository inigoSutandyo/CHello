import { addDoc, collection, Timestamp } from "firebase/firestore"
import { db } from "../util/FireBaseConfig"

export const addTemplateList = async (boardId) => {
    const listRef = await addDoc(collection(db, `boards/${boardId}/lists`), {
        title: "TO DO",
        datecreated: Timestamp.now()
    })

    return listRef
}
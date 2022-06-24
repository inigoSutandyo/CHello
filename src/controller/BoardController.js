import { collection, doc, getDoc, getDocs, query, Timestamp, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../util/FireBaseConfig"

export const useBoards = (userId, workspaceId) => {
    const [boards, setBoards] = useState(null)
    
    useEffect(() => {
        if (userId == null || workspaceId == null) {
            return
        }
        const loadQuery = async () => {
            
            try {
                const workspaceRef = doc(db, 'workspaces', workspaceId)
                const workspaceSnap = await getDoc(workspaceRef)
                const boardRef = []
                if (workspaceSnap.exists()) {
                    workspaceSnap.data().boards.forEach(doc => {
                        boardRef.push(doc.id)
                    });
                }
                const docRef = doc(db,'users',userId)
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
    }, [userId])
    return boards;
}
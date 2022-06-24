import { collection, doc, getDoc, getDocs, query, Timestamp, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../util/FireBaseConfig"

export const useBoards = (userId, workspaceId) => {
    const [boards, setBoards] = useState(null)
    
    // TODO: can be change for better performance

    const getWorkspace = async () => {
        const workspaceRef = doc(db,'workspaces',workspaceId)
        const workspaceSnapshot = await getDoc(workspaceRef)
        
        // console.log("ID = " + workspaceId)
        if (workspaceSnapshot.exists()) {
            const refBoards = []
            workspaceSnapshot.data().boards.forEach(element => {
                refBoards.push(element.id)
            });
            return refBoards
        } else {
            return null
        }
    }
    
    // console.log(userId)
    useEffect(() => {
        getWorkspace().then((refBoards) => {
            if (refBoards == null) {
                return
            }
            const docRef = doc(db, 'users', userId)
            const documents = []
            const q = query(collection(db, "boards"), where('admins', "array-contains", docRef), where('uid', 'in', refBoards))
            const loadQuery = async () => {
                try {
                    const querySnapshot = await getDocs(q)
                    // console.log(querySnapshot)
                    if (querySnapshot) {
                        
                        querySnapshot.forEach(element => {
                            // console.log(querySnapshot)
                            documents.push({
                                ...element.data()
                            })
                        });   
                    }
                    
                } catch (e) {
                    console.log(e)
                }
            }
            loadQuery()
            console.log(documents)
            setBoards(documents)      
        })
    }, [userId])
    console.log(boards)
    return boards;
}

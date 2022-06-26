import { addDoc, collection, doc, getDoc, getDocs, query, Timestamp, updateDoc, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../util/FireBaseConfig"

export const useWorkspace = (userId) => {
    const [workspace, setWorkspace] = useState(null)
    
    useEffect(() => {
        if (userId == null) {
            
            return
        }
        const docRef = doc(db,'users',userId)
        const q = query(collection(db, "workspaces"), where('admins', "array-contains", docRef))
        const loadQuery = async () => {
            try {
                const querySnapshot = await getDocs(q)
                console.log(querySnapshot)
                if (querySnapshot) {
                    const documents = []
                    querySnapshot.forEach(element => {
                        console.log(querySnapshot)
                        documents.push({
                            ...element.data()
                        })
                    });
    
                    setWorkspace(documents)
                }
                
            } catch (e) {
                console.log(e)
            }
        }
        loadQuery()
    }, [userId])

    return workspace;
}


export const useWorkspaceById = (workspaceId) => {
    const [workspace, setWorkspace] = useState(null)
    
    useEffect(() => {
        const loadAsync = async () => {
            const docRef = doc(db, 'workspaces', workspaceId)
            const docSnap = await getDoc(docRef)
            
            if (docSnap.exists()) {
                setWorkspace(docSnap.data())
            }
        }
        loadAsync()
    }, [workspaceId]);
    console.log()
    return workspace
}

export const addNewWorkspace = async (e) => {
    console.log("Adding")
    e.preventDefault()

    const name = e.target.elements.workSpaceName.value
    const userId = e.target.elements.userId.value
    
    const userRef = doc(db, 'users', userId)

    const docRef = await addDoc(collection(db, "workspaces"), {
        name: name,
        datecreated: Timestamp.now(),
        admins: [userRef],
        members: [],
        boards: [],
        visibility: "public"
    });

    console.log(docRef)

    await updateDoc(docRef, {
        uid: docRef.id
    })
    
    e.target.elements.workSpaceName.value = ""
    window.location.reload()
}

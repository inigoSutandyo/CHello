import { addDoc, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../util/FireBaseConfig";

export const inviteUser = async (sourceId, memberEmail, spaceId, spaceType, memberType) => {
    
    const spaceRef = doc(db, spaceType, spaceId);

    const sourceRef = doc(db, "users", sourceId);
    const sourceSnap = await getDoc(sourceRef)

    const q = query(collection(db, 'users'), where('email','==',memberEmail));
    const querySnapshot = await getDocs(q);
    const destinationRef = []
    querySnapshot.forEach((document) => {
        destinationRef.push(doc(db, "users", document.id))
    });
    // console.log(destinationRef[0])

    
    if (destinationRef[0]) {
        await addDoc(collection(db, 'invitations'), {
            sourceRef: sourceRef,
            sourceEmail: sourceSnap.data().email,
            destinationRef: destinationRef[0],
            spaceRef: spaceRef,
            membership: memberType,
            spaceType: spaceType
        })
    }
    
    // e.target.elements.value = ""
    // window.location.reload();
}

export const useInvite = (userId, updater) => {
    const [invites, setInvites] = useState([])

    useEffect(() => {
        if (!userId) {return}
      const loadData = async () => {
        const userRef = doc(db, "users", userId);
        const q = query(collection(db, 'invitations'), where('destinationRef','==',userRef));
        const querySnapshot = await getDocs(q);
        const inviteList = []

        querySnapshot.forEach((doc) => {
            inviteList.push({
                uid: doc.id,
                ...doc.data()
            })
        });
        setInvites(inviteList);
      }
      loadData();
    }, [updater])
    
    return invites
}
  
export const acceptInvite = async (spaceRef, userRef, inviteId, memberType) => {
    // update workspace
    if (memberType == "member" ) {
        await updateDoc(spaceRef, {
            members: arrayUnion(userRef)
        })
    }
        

    destroyInvite(inviteId);
}

export const destroyInvite = async (inviteId) => {
    await(deleteDoc(doc(db,'invitations',inviteId)));
}
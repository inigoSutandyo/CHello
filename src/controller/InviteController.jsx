import { addDoc, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, query, Timestamp, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { convertToDate } from "../util/DateTime";
import { db } from "../util/FireBaseConfig";

export const inviteUser = async (sourceId, memberEmail, spaceId, spaceType, memberType) => {
    
    const spaceRef = doc(db.getDB(), spaceType, spaceId);

    const sourceRef = doc(db.getDB(), "users", sourceId);
    const sourceSnap = await getDoc(sourceRef)

    const q = query(collection(db.getDB(), 'users'), where('email','==',memberEmail));
    const querySnapshot = await getDocs(q);
    const destinationRef = []
    querySnapshot.forEach((document) => {
        destinationRef.push(doc(db.getDB(), "users", document.id))
    });
    // console.log(destinationRef[0])

    
    if (destinationRef[0]) {
        await addDoc(collection(db.getDB(), 'invitations'), {
            sourceRef: sourceRef,
            sourceEmail: sourceSnap.data().email,
            destinationRef: destinationRef[0],
            spaceRef: spaceRef,
            membership: memberType,
            spaceType: spaceType,
            date: Timestamp.now()
        })
    }
    
    // e.target.elements.value = ""
    // window.location.reload();
}

export const notifyUser = async (userId, message) => {
    const userRef = doc(db.getDB(), "users", userId);
    await addDoc(collection(db.getDB(), 'notifications'), {
        target: userRef,
        message: message,
        date: Timestamp.now()
    })
}

export const useInvite = (userId, updater) => {
    const [invites, setInvites] = useState([])

    useEffect(() => {
        if (!userId) {return}
      const loadData = async () => {
        const userRef = doc(db.getDB(), "users", userId);
        const q = query(collection(db.getDB(), 'invitations'), where('destinationRef','==',userRef));
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
    console.log(invites)
    return invites
}
  
export const useNotification = (userId, updater) => {
    const [notifications, setNotifications] = useState()
    useEffect(() => {
      if (!userId) return

      const notifList = []
      const loadData = async () => {
        const userRef = doc(db.getDB(), "users", userId);
        const userSnap = await getDoc(userRef)
        const user = userSnap.data()
        

        const freq = user.frequency ? user.frequency : "always"
        if (freq === "never") {
            setNotifications(null)
            return
        }
        const lastNotif = user.lastnotif && freq === "periodically" ? convertToDate(user.lastnotif.toDate()) : null
            
        const now = Date.now()

        try {
            const q = query(collection(db.getDB(), 'notifications'));
            const querySnapshot = await getDocs(q);
            
            querySnapshot.forEach((doc) => {

                if (userRef.id == doc.data().target.id) {
                    if (lastNotif !== null && Math.floor((now - lastNotif) / (1000*60*60*24)) >= 1) {
                        notifList.push({
                            uid: doc.id,
                            ...doc.data()
                        })
                    } 
                    if (lastNotif === null && freq === "always") {
                        notifList.push({
                            uid: doc.id,
                            ...doc.data()
                        })
                    }
                }
            });
        } catch (error) {
            console.log(error)
        }
        if (lastNotif !== null && notifList.length > 0) {
            await updateDoc(userRef, {
                lastnotif: Timestamp.now()
            })    
        }
        setNotifications(notifList)
      }
      loadData()
    }, [updater])
    return notifications
}

export const createNotifications = async (userRef, spaceRef) => {
    const userSnap = await getDoc(userRef)
    const spaceSnap = await getDoc(spaceRef)
    if (spaceSnap.exists() && userSnap.exists()) {
        const title = spaceSnap.data().title ? spaceSnap.data().title : spaceSnap.data().name
        const msg = `${userSnap.data().email} joined ${title}`
        const admins = spaceSnap.data().admins
        const members = spaceSnap.data().members
        admins.forEach(async (admin) => {
            if (admin.id != userRef.id) {
                await notifyUser(admin.id, msg)
            }
        });
    
        members.forEach(async (member) => {
            if (member.id != userRef.id) {
                await notifyUser(member.id, msg)
            }
        });
    }
}

export const acceptInvite = async (spaceRef, userRef, inviteId) => {
    // update workspace
    await updateDoc(spaceRef, {
        members: arrayUnion(userRef)
    }).then(()=>{console.log("updated")})

   


    await destroyInvite(inviteId);
    console.log("done")
}

export const destroyInvite = async (inviteId) => {
    await(deleteDoc(doc(db.getDB(),'invitations',inviteId)));
}

export const destroyNotification = async (notifId) => {
    console.log("deleting")
    await(deleteDoc(doc(db.getDB(),'notifications',notifId)));
}

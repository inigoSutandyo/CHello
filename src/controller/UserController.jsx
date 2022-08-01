import { AuthCredential, createUserWithEmailAndPassword, EmailAuthProvider, reauthenticateWithCredential, signInWithEmailAndPassword, signOut, updatePassword, updateProfile } from "firebase/auth"
import { auth, db } from "../util/FireBaseConfig"
import { collection, doc, getDoc, getDocs, setDoc, Timestamp, updateDoc } from "firebase/firestore"; 
import { createUser } from "../factory/UserFactory";
import { useEffect, useState } from "react";
import { convertToDate } from "../util/DateTime";

export const registerAuth = async (email, password, confirm) => {
    // console.log(email + " " + password)

    if (!email || !password || !confirm) {
        return "Fields cannot be empty!";
    }
    else if (password != confirm) {
        return "Confirm Password and Password must be the same !!";
    }

    try {
        const user = await createUserWithEmailAndPassword(auth.getAuth(), email, password)
        const userData = createUser(user.user.uid, email, email.substr(0, email.indexOf('@')), password).toDictionary()
        await setDoc(doc(db.getDB(), "users", user.user.uid), userData)
        return ""
    } catch (error) {
        return 'Register failed, email already taken!!';
    }
    
}

export const loginAuth = async (email, password) =>{
    try {
        const user = await signInWithEmailAndPassword(auth.getAuth(), email, password)
        return ""
    } catch (error) {
        return 'Login failed, user not found!';
    }
}

export const loginGetId = async (email, password) =>{
    try {
        const user = await signInWithEmailAndPassword(auth.getAuth(), email, password)
        console.log(user.user.uid)
        return {
            error: false,
            uid: user.user.uid
        }
    } catch (error) {
        return {
            error: true,
            msg: 'Login failed, user not found!'
        };
    }
}

export const logoutAuth = async () => {
    await signOut(auth.getAuth());
}

export const updateUser = async (userId, dob, description, privacy, frequency) => {
    await updateDoc(doc(db.getDB(), 'users', userId), {
        description: description,
        dob: dob ? Timestamp.fromDate(dob) : null,
        privacy: privacy,
        frequency: frequency
    })
    return ""
}

export const changePassword = async (email, newpassword, oldpassword, userId, setLoading, setError, setPassword) => {
    const user = auth.getAuth().currentUser
    reauthenticateWithCredential(user, EmailAuthProvider.credential(email, oldpassword)).then(() => {
        updatePassword(user, newpassword).then(async () => {
            await updateDoc(doc(db.getDB(), 'users', userId), {
                password: newpassword
            })
            console.log("updated")
            setPassword(false)
            setLoading(false)
            return ""
        }).catch((error)=> {
            console.log(error)
            setError("Update Error!") 
            setLoading(false)
        })
    }).catch((error) => {
        console.log(error)
        setError("Update Error!") 
        setLoading(false)
    })
}

export const useUser = (userId, updater) => {
    const [user, setUser] = useState()
    useEffect(() => {
        if (!userId) return
      const loadData = async () => {
        const userSnap = await getDoc(doc(db.getDB(), 'users', userId))
        if (userSnap.exists()) {
            const date_birth = userSnap.data().dob ? convertToDate(userSnap.data().dob.toDate()) : null
            setUser({
                date_birth: date_birth,
                ...userSnap.data()
            })
        }
      }

      loadData()
    }, [userId, updater])
    return user
}

export const useMentions = (userId) => {
    const [users, setUsers] = useState()

    useEffect(() => {
      const data = []
      const loadData = async () => {
        try {     
            const docSnap = await getDocs(collection(db.getDB(), 'users'))
            if (docSnap) {
                let i = 0
                docSnap.forEach(doc => {
                    const privacy = doc.data().privacy ? doc.data().privacy : null
                    if (doc.id != userId && privacy !== "private") {
                        data.push({
                            display: doc.data().email,
                            id: doc.id
                        })
                    }
                });
            }
        } catch (error) {
            console.log(error)
        }
        setUsers(data)
      }
      loadData()
    }, [])
    // console.log(users)
    return users
}
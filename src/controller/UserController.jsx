import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { auth, db } from "../util/FireBaseConfig"
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore"; 
import { createUser } from "../factory/UserFactory";
import { useEffect, useState } from "react";

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

export const logoutAuth = async () => {
    await signOut(auth.getAuth());
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
                    if (doc.id != userId) {
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
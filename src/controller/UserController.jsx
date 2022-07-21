import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { auth, db } from "../util/FireBaseConfig"
import { doc, setDoc } from "firebase/firestore"; 

export const registerAuth = async (email, password, confirm) => {
    // console.log(email + " " + password)

    if (!email || !password || !confirm) {
        return "Fields cannot be empty!";
    }
    else if (password != confirm) {
        return "Confirm Password and Password must be the same !!";
    }

    try {
        const user = await createUserWithEmailAndPassword(auth, email, password)
        console.log(user)
        await setDoc(doc(db, "users", user.user.uid), {
            email: email,
            uid: user.user.uid,
            name: email.substr(0, email.indexOf('@')),
            password: password
        })
        return ""
    } catch (error) {
        console.log(error.message)
        return error.message;
    }
    
}

export const loginAuth = async (email, password) =>{
    try {
        const user = await signInWithEmailAndPassword(auth, email, password)
        return ""
    } catch (error) {
        return error.message;
    }
}

export const logoutAuth = async () => {
    await signOut(auth);
}



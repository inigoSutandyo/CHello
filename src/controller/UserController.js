import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { auth } from "../util/FireBaseConfig"


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



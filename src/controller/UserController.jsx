import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { auth, db } from "../util/FireBaseConfig"
import { doc, setDoc } from "firebase/firestore"; 
import { createUser } from "../factory/UserFactory";

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



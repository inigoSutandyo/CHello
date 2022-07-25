import User from "../model/User"

export const createUser = (uid, email, name, password) => {
    return new User(uid, email, name, password, null, null)
}
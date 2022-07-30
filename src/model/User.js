export default class User {
    constructor(uid, email, name, password, dob, description, privacy) {
        this.uid = uid;
        this.email = email;
        this.name = name;
        this.password = password;
        this.dob = dob;
        this.description = description
    }

    toDictionary() {
        return {
            uid: this.uid,
            email: this.email,
            name: this.name,
            password: this.password,
            dob: this.dob,
            description: this.description
        }
    }
}
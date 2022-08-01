export default class Workspace {
    
    constructor(admins, members, boards, name, visibility, datecreated) {
        this.admins = admins;
        this.members = members;
        this.boards = boards;
        this.name = name;
        this.visibility = visibility;
        this.datecreated = datecreated;
    }

    toDictionary() {
        return {
            admins : this.admins,
            members : this.members,
            boards : this.boards,
            name : this.name,
            visibility : this.visibility,
            datecreated : this.datecreated
        }
    }
}

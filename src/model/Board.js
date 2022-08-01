export default class Board {
    constructor(admins, members, datecreated, title, visibility, closed) {
        this.admins = admins;
        this.members = members;
        this.datecreated = datecreated;
        this.title = title;
        this.visibility = visibility;
        this.closed = closed
    }

    toDictionary() {
        return {
            admins : this.admins,
            members : this.members,
            datecreated : this.datecreated,
            title : this.title,
            visibility : this.visibility,
            closed : this.closed
        }
    }
}
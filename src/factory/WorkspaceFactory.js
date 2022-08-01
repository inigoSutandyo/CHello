import Workspace from "../model/Workspace"

export const createNewWorkspace = (admins, name, datecreated) => {

    return new Workspace(admins, [], [], name, "public", datecreated)
}
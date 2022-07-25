export const createWorkspace = (admins, name) => {

    return new Workspace(admins, [], [], name, "public")
}
import Board from "../model/Board"

export const createNewBoard = (title, datecreated) => {
    return new Board([], [], datecreated, title, "public", false)
}
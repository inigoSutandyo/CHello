import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { IconContext } from "react-icons/lib";
import { changeFavorites } from "../../../controller/BoardController";

export const BoardListComponent = ({
  board,
  userId,
  favorites,
  membership,
  setIsModal,
  setModalTitle,
  setSelectedBoard,
  setOpen,
  handleFavoriteUpdate
}) => {
  
  const checkFavorites = (boardId) => {
    if (!favorites) return false
    for (let i = 0; i < favorites.length; i++) {
      const data = favorites[i];
      if (data.uid === boardId) {
        return true
      }
      
    }
  }

  return (
    <>
      <div
        className="card me-5 mb-3 text-bg-dark p-1"
        key={board.uid}
        style={{ width: "20%" }}
      >
        <div className="card-body d-flex flex-column">
          <div className="d-flex d-row justify-content-between mb-1">
            <h5 className="card-title mb-3 text-wrap">{board.title}</h5>
            <div style={{cursor:"pointer"}} onClick={() => {
              const fav = checkFavorites(board.uid)
              changeFavorites(!fav, userId, board.uid).then(handleFavoriteUpdate)
            }}>
              {checkFavorites(board.uid) ? (
                <IconContext.Provider
                  value={{ color: 'yellow', size: '20px' }}
                >
                  <AiFillStar/>
                </IconContext.Provider>
              ) : (
                <IconContext.Provider
                  value={{ size: '20px' }}
                >
                  <AiOutlineStar/>
                </IconContext.Provider>
              )}
            </div>
          </div>
          <div className="d-flex flex-row justify-content-between align-items-center">
            {membership !== "none" || board.visibility === "public" || board.curr_membership !== "none" ? (
              <Link to={`/board/${board.uid}`} className="me-2">
                <div className="btn btn-primary">Open</div>
              </Link>
            ) : <></>}
            {board.curr_membership === "admin" ? (
              <a
                className="btn text-warning fs-4"
                onClick={() => {
                  setIsModal(true)
                  setOpen(!board.closed)
                  setSelectedBoard(board.uid)
                  setModalTitle("Board Detail")
                }}
              >
                <FaEdit />
              </a>
            ) : <></>}
          </div>
        </div>
      </div>
    </>
  );
};

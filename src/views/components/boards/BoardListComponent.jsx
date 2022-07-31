import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";

export const BoardListComponent = ({
  board,
  membership,
  setIsModal,
  setModalTitle,
  setSelectedBoard,
  setOpen
}) => {
  return (
    <>
      <div
        className="card me-5 mb-3 text-bg-dark p-1"
        key={board.uid}
        style={{ width: "20%" }}
      >
        <div className="card-body d-flex flex-column">
          <h4 className="card-title mb-3 text-wrap">{board.title}</h4>
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

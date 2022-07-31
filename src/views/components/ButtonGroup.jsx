import React from "react";

export const ButtonGroup = ({
  setIsModal,
  setModalTitle,
  handleUserRemoval,
  board,
  navigate,
  handleVisibility,
  currentUserId,
}) => {
  return (
    <div>
      <div className="d-flex flex-column">
        <div className="d-flex flex-row mb-3">
          <button
            className="btn btn-info mx-1"
            onClick={() => {
              setIsModal(true);
              setModalTitle("Board Members");
            }}
          >
            Members
          </button>
          <button
            className="btn btn-danger mx-1"
            onClick={async () => {
              handleUserRemoval(currentUserId)
              navigate(-1);
            }}
          >
            Leave Board
          </button>
        </div>
        {board.curr_membership === "admin" ? (
            <div className="mx-1 d-flex w-50">
                <label htmlFor="visibility" className="me-3">
                    Visibility
                </label>
                <select
                    name="visibility"
                    className="form-control"
                    id="visibility"
                    defaultValue={board.visibility}
                    onChange={() => {
                    const visibility = document.getElementById("visibility").value;
                    handleVisibility(visibility);
                    }}
                >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                </select>
            </div>
        ) : <></>}
      </div>
    </div>
  );
};

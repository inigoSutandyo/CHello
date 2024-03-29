import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  addNewBoard,
  deleteBoard,
  useBoards,
  useFavoriteBoards,
} from "../../../controller/BoardController";
import {
  changeMembership,
  changeVisibility,
  joinWorkspace,
  removeUserWorkspace,
  useWorkspaceById,
} from "../../../controller/WorkspaceController";
import { BoardDetailComponent } from "../../components/boards/BoardDetailComponent";
import { BoardListComponent } from "../../components/boards/BoardListComponent";
import { LoadingComponent } from "../../components/LoadingComponent";
import { ModalComponent } from "../../components/ModalComponent";
import { WorkspaceMemberComponent } from "../../components/workspaces/WorkspaceMemberComponent";
import { VscAdd } from "react-icons/vsc";
import { FaArrowLeft } from "react-icons/fa";

export const BoardPage = ({ userId }) => {
  const { workspaceId } = useParams();
  // console.log(workspaceId)
  const [sessionUser, setSessionUser] = useState(userId);
  const [updater, setUpdater] = useState(0);
  const [workspaceUpdater, setWorkspaceUpdater] = useState(0);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const workspace = useWorkspaceById(workspaceId, userId, workspaceUpdater);
  useEffect(() => {
    setSessionUser(userId);
    setWorkspaceUpdater(workspaceUpdater + 1);
  }, [userId]);

  useEffect(() => {
    setUpdater(updater + 1);
  }, [workspace]);

  const boards = useBoards(sessionUser, workspace, updater);
  const [isModal, setIsModal] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [open, setOpen] = useState(true)
  const handleUpdateWorkspace = () => {
    setWorkspaceUpdater(workspaceUpdater + 1);
  };

  const handleMembershipChange = (userId) => {
    changeMembership(userId, workspaceId).then(() => {
      console.log(userId);
      setWorkspaceUpdater(workspaceUpdater + 1);
    });
  };

  const handleUserRemoval = (userId) => {
    removeUserWorkspace(userId, workspaceId).then(() => {
      console.log(userId);
      setWorkspaceUpdater(workspaceUpdater + 1);
    });
  };

  const navigate = useNavigate();
  const [favoriteUpdater, setFavoriteUpdater] = useState(0)
  const handleFavoriteUpdate = () => {
    setFavoriteUpdater(favoriteUpdater+1)
  }
  const favorites = useFavoriteBoards(userId, favoriteUpdater)

  return (
    <>
      {boards != null && workspace != null && sessionUser != null ? (
        <div className="m-3" id="board-page">
          <div className="d-flex justify-content-start">
            <div
              onClick={() => {
                navigate(-1);
              }}
              style={{
                cursor: "pointer",
              }}
            >
              <FaArrowLeft />
            </div>
          </div>
          <div className="fs-3">
            <p color="text-primary">{workspace.name}</p>
            {workspace.curr_membership === "admin" ? (
              <div className="d-flex flex-column">
                <div className="d-flex flex-row mb-3">
                  <button
                    className="btn btn-info mx-1"
                    onClick={() => {
                      setIsModal(true);
                      setModalTitle("Workspace Members");
                    }}
                  >
                    Members
                  </button>
                  <button
                    className="btn btn-danger mx-1"
                    onClick={async () => {
                      await removeUserWorkspace(userId, workspaceId).then(
                        () => {
                          setWorkspaceUpdater(workspaceUpdater + 1);
                        }
                      );
                      navigate(-1);
                    }}
                  >
                    Leave Workspace
                  </button>
                </div>

                <div className="mx-1 d-flex w-50">
                  <label htmlFor="visibility" className="me-3">
                    Visibility:{" "}
                  </label>
                  <select
                    name="visibility"
                    className="form-control"
                    id="visibility"
                    defaultValue={workspace.visibility}
                    onChange={() => {
                      const visibility =
                        document.getElementById("visibility").value;
                      changeVisibility(workspaceId, visibility).then(
                        setWorkspaceUpdater(workspaceUpdater + 1)
                      );
                    }}
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>
            ) : workspace.curr_membership === "member" ? (
              <div className="d-flex">
                <button
                  className="btn btn-info"
                  onClick={() => {
                    setIsModal(true);
                    setModalTitle("Workspace Members");
                  }}
                >
                  Members
                </button>
                <button
                  className="btn btn-danger mx-2"
                  onClick={async () => {
                    removeUserWorkspace(userId, workspaceId).then(() => {
                      setWorkspaceUpdater(workspaceUpdater + 1);
                    });
                    navigate(-1);
                  }}
                >
                  Leave Workspace
                </button>
              </div>
            ) : (
              <div>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    joinWorkspace(userId, workspaceId).then(() =>
                      setWorkspaceUpdater(workspaceUpdater + 1)
                    );
                  }}
                >
                  Join Workspace
                </button>
              </div>
            )}
            <p className="text-muted">Boards</p>
          </div>

          <div className="mx-2 mt-5 d-flex flex-wrap">
            {boards.length === 0 ? (
              <h1 className="fs-2 fw-bold">
                No Boards created yet. Why don't you go ahead and create one?
              </h1>
            ) : (
              boards.map((b) => (
                <BoardListComponent
                  board={b}
                  userId = {userId}
                  favorites = {favorites}
                  membership={workspace.curr_membership}
                  setModalTitle={setModalTitle}
                  setIsModal={setIsModal}
                  key={b.uid}
                  setSelectedBoard={setSelectedBoard}
                  setOpen={setOpen}
                  handleFavoriteUpdate = {handleFavoriteUpdate}
                />
              ))
            )}
          </div>
          <div>
            {workspace.curr_membership != "admin" ? (
              <div></div>
            ) : (
              <form
                className="row g-2 mx-2 mt-5 p-1"
                onSubmit={(e) => {
                  addNewBoard(e).then(() => {
                    handleUpdateWorkspace();
                  });
                }}
              >
                <input
                  type="hidden"
                  name="workSpaceId"
                  id="workSpaceId"
                  value={workspaceId}
                />
                <input
                  type="hidden"
                  name="userId"
                  id="userId"
                  value={sessionUser}
                />
                <div className="col-auto">
                  <input
                    required
                    type="text"
                    className="form-control"
                    name="boardTitle"
                    id="boardTitle"
                    placeholder="Add Board"
                  />
                </div>
                <div className="col-auto">
                  <button
                    type="submit"
                    className="btn btn-primary mb-3 px-2 py-1"
                  >
                    <VscAdd />
                  </button>
                </div>
              </form>
            )}
          </div>

          <ModalComponent
            isModal={isModal}
            setIsModal={setIsModal}
            text={modalTitle}
            appELement={"#board-page"}
          >
            {modalTitle === "Workspace Members" ? (
              <WorkspaceMemberComponent
                workSpace={workspace}
                userId={userId}
                handleMembershipChange={handleMembershipChange}
                handleUserRemoval={handleUserRemoval}
                membership={workspace.curr_membership}
              />
            ) : modalTitle === "Board Detail" ? (
              <BoardDetailComponent
                isOpen={open}
                boardId={selectedBoard}
                handleUpdateWorkspace={handleUpdateWorkspace}
                setIsModal={setIsModal}
              />
            ) : (
              <div></div>
            )}
          </ModalComponent>
        </div>
      ) : (
        <LoadingComponent />
      )}
    </>
  );
};

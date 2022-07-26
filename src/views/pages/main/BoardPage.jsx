import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  addNewBoard,
  deleteBoard,
  useBoards,
} from "../../../controller/BoardController";
import {
  changeMembership,
  removeUserWorkspace,
  useWorkspaceById,
} from "../../../controller/WorkspaceController";
import { BoardListComponent } from "../../components/boards/BoardListComponent";
import { LoadingComponent } from "../../components/LoadingComponent";
import { ModalComponent } from "../../components/ModalComponent";
import { WorkspaceMemberComponent } from "../../components/workspaces/WorkspaceMemberComponent";

export const BoardPage = ({ userId }) => {
  const { workspaceId, membership } = useParams();
  // console.log(workspaceId)
  const [sessionUser, setSessionUser] = useState(userId);
  const [updater, setUpdater] = useState(0);
  const [workspaceUpdater, setWorkspaceUpdater] = useState(0);

  const workspace = useWorkspaceById(workspaceId, workspaceUpdater);
  // console.log(workspace.uid)
  useEffect(() => {
    const intervalId = setInterval(() => {
      setWorkspaceUpdater(workspaceUpdater + 1);
    }, 2500);

    return () => clearInterval(intervalId);
  }, [workspace]);

  useEffect(() => {
    setSessionUser(userId);
  }, [userId]);

  useEffect(() => {
    setUpdater(updater + 1);
  }, [workspace]);

  const boards = useBoards(sessionUser, workspace, updater);
  const [isModal, setIsModal] = useState(false);
  const [modalTitle, setModalTitle] = useState();

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

  return (
    <>
      {boards != null && workspace != null && sessionUser != null ? (
        <div className="m-3" id="board-page">
          <div className="fs-3">
            <p color="text-primary">{workspace.name}</p>
            {membership != "admin" ? (
              <div></div>
            ) : (
              <button
                className="btn btn-info"
                onClick={() => {
                  setIsModal(true);
                  setModalTitle("Workspace Members");
                }}
              >
                Members
              </button>
            )}
            <p className="text-muted">Boards</p>
          </div>
          <BoardListComponent
            boards={boards}
            sessionUser={sessionUser}
            workSpaceId={workspaceId}
            addNewBoard={addNewBoard}
            deleteBoard={deleteBoard}
            updater={updater}
            setUpdater={setUpdater}
            membership={membership}
          />
          <ModalComponent
            isModal={isModal}
            setIsModal={setIsModal}
            text={modalTitle}
            appELement={"#board-page"}
          >
            <WorkspaceMemberComponent
              workSpace={workspace}
              userId={userId}
              handleMembershipChange={handleMembershipChange}
              handleUserRemoval = {handleUserRemoval}
            />
          </ModalComponent>
        </div>
      ) : (
        <LoadingComponent />
      )}
    </>
  );
};

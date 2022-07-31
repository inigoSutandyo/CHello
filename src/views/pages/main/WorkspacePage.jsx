import React, { useEffect } from "react";
import { useState } from "react";
import { useAllBoards } from "../../../controller/BoardController";
import {
  addNewWorkspace,
  usePublicWorkspace,
  useWorkspace,
} from "../../../controller/WorkspaceController";
import { BoardDetailComponent } from "../../components/boards/BoardDetailComponent";
import { BoardListComponent } from "../../components/boards/BoardListComponent";
import { LoadingComponent } from "../../components/LoadingComponent";
import { ModalComponent } from "../../components/ModalComponent";
import { SearchBar } from "../../components/SearchBar";
import { WorkspaceListComponent } from "../../components/workspaces/WorkspaceListComponent";


export const WorkspacePage = ({ userId }) => {
  const [updater, setUpdater] = useState(0);
  const [sessionUser, setSessionUser] = useState(null);

  useEffect(() => {
    setSessionUser(userId);
    setUpdater(updater + 1);
  }, [userId]);

  const [searchWorkspace, setSearchWorkspace] = useState("")
  const [searchBoard, setSearchBoard] = useState("")
  
  const [selectedBoard, setSelectedBoard] = useState(null)
  const [isModal, setIsModal] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [open, setOpen] = useState(true)

  const {workspaces, fixedWorkspaces} = useWorkspace(sessionUser, updater, searchWorkspace);
  const publicWorkspaces = usePublicWorkspace(fixedWorkspaces, searchWorkspace)
  const {openBoards, closedBoards} = useAllBoards(userId, fixedWorkspaces)

  const handleUpdateWorkspace = () => {
    setUpdater(updater + 1);
  }

  return (
    <div id="workspace-page">
      {workspaces == null || sessionUser == null ? (
        <LoadingComponent />
      ) : (
        <div className="m-3">
          <div className="mb-2">
            <div>
              <h3>My Workspaces</h3>
            </div>
            <SearchBar setSearchOne={setSearchBoard} setSearchTwo={setSearchWorkspace} termOne={"Board"} termTwo={"Workspace"}/>

            <WorkspaceListComponent
              workspaces={workspaces}
              sessionUser={sessionUser}
              addNewWorkSpace={addNewWorkspace}
              updater={updater}
              setUpdater={setUpdater}
              isMember={true}
            />
          </div>
          {publicWorkspaces ? (
            <div className="mb-2">
              <div>
                <h3>Public Workspaces</h3>
              </div>
              <WorkspaceListComponent
                workspaces={publicWorkspaces}
                sessionUser={sessionUser}
                addNewWorkSpace={addNewWorkspace}
                updater={updater}
                setUpdater={setUpdater}
                isMember={false}
              />
            </div>
          ) : <div></div>}

          {openBoards ? (
            <div className="mb-2">
              <h3>Open Boards</h3>
              <div className="mx-2 mt-2 d-flex flex-wrap">
                {openBoards.map(b => (
                  <BoardListComponent
                    board={b}
                    membership={"none"}
                    setIsModal={setIsModal}
                    setModalTitle={setModalTitle}
                    setSelectedBoard={setSelectedBoard}
                    setOpen={setOpen}
                    key={b.uid}
                  />
                ))}
              </div>
            </div>
          ) : <></>}
          {closedBoards ? (
            <div className="my-5">
              <h3>Closed Boards</h3>
              <div className="mx-2 mt-2 d-flex flex-wrap">
                {closedBoards.length === 0 ? <p>No Closed Boards</p> : (
                  closedBoards.map(b => (
                    <BoardListComponent
                      board={b}
                      membership={"none"}
                      setIsModal={setIsModal}
                      setModalTitle={setModalTitle}
                      setSelectedBoard={setSelectedBoard}
                      setOpen={setOpen}
                      key={b.uid}
                    />
                  ))
                )}
              </div>
            </div>
          ) : <></>}
        </div>
      )}

      <ModalComponent
        isModal={isModal}
        setIsModal={setIsModal}
        text={modalTitle}
        appELement={"#workspace-page"}
      >
        {modalTitle === "Board Detail" ? (
          <BoardDetailComponent
            boardId={selectedBoard}
            handleUpdateWorkspace={handleUpdateWorkspace}
            isOpen={open}
            setIsModal={setIsModal}
          />
        ) : <></>}
      </ModalComponent>
    </div>
  );
};

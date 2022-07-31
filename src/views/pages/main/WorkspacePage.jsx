import React, { useEffect } from "react";
import { useState } from "react";
import { useAllBoards, useFavoriteBoards } from "../../../controller/BoardController";
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

  const [searchWorkspace, setSearchWorkspace] = useState("");
  const [searchBoard, setSearchBoard] = useState("");

  const [selectedBoard, setSelectedBoard] = useState(null);
  const [isModal, setIsModal] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [open, setOpen] = useState(true);

  const { workspaces, fixedWorkspaces } = useWorkspace(
    sessionUser,
    updater,
    searchWorkspace
  );
  const publicWorkspaces = usePublicWorkspace(fixedWorkspaces, searchWorkspace);
  const { openBoards, closedBoards } = useAllBoards(
    userId,
    fixedWorkspaces,
    searchBoard
  );

  const handleUpdateWorkspace = () => {
    setUpdater(updater + 1);
  };

  const [favoriteUpdater, setFavoriteUpdater] = useState(0)
  const handleFavoriteUpdate = () => {
    setFavoriteUpdater(favoriteUpdater+1)
  }
  const favorites = useFavoriteBoards(userId, favoriteUpdater)

  return (
    <div className="accordion" id="workspace-page">
      {workspaces == null || sessionUser == null ? (
        <LoadingComponent />
      ) : (
        <div className="m-3">
          <div className="mb-2">
            <SearchBar
              setSearchOne={setSearchBoard}
              setSearchTwo={setSearchWorkspace}
              termOne={"Board"}
              termTwo={"Workspace"}
            />
          </div>

          <div className="mb-2 accordion-item">
            <h2 className="accordion-header" id="panelsStayOpen-headingOne">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseOne"
                aria-expanded="true"
                aria-controls="panelsStayOpen-collapseOne"
              >
                My Workspace
              </button>
            </h2>
            <div
              id="panelsStayOpen-collapseOne"
              className="accordion-collapse collapse show"
              aria-labelledby="panelsStayOpen-headingOne"
            >
              <div className="accordion-body">
                <WorkspaceListComponent
                  workspaces={workspaces}
                  sessionUser={sessionUser}
                  addNewWorkSpace={addNewWorkspace}
                  updater={updater}
                  setUpdater={setUpdater}
                  isMember={true}
                />
              </div>
            </div>
          </div>
          {publicWorkspaces ? (
            <div className="mb-2 accordion-item">
              <h2 className="accordion-header" id="panelsStayOpen-headingTwo">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapseTwo"
                  aria-expanded="false"
                  aria-controls="panelsStayOpen-collapseTwo"
                >
                  Other Workspace
                </button>
              </h2>
              <div
                id="panelsStayOpen-collapseTwo"
                className="accordion-collapse collapse"
                aria-labelledby="panelsStayOpen-headingTwo"
              >
                <div className="accordion-body">
                  <WorkspaceListComponent
                    workspaces={publicWorkspaces}
                    sessionUser={sessionUser}
                    addNewWorkSpace={addNewWorkspace}
                    updater={updater}
                    setUpdater={setUpdater}
                    isMember={false}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div></div>
          )}
          
          {openBoards ? (
            <div className="mb-2 accordion-item">
              <h2 className="accordion-header" id="panelsStayOpen-headingThree">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapseThree"
                  aria-expanded="false"
                  aria-controls="panelsStayOpen-collapseThree"
                >
                  Boards
                </button>
              </h2>
              <div
                id="panelsStayOpen-collapseThree"
                className="accordion-collapse collapse"
                aria-labelledby="panelsStayOpen-headingThree"
              >
                <div className="accordion-body">
                  <div className="mx-2 mt-2 d-flex flex-wrap">
                    {openBoards.map((b) => (
                      <BoardListComponent
                        board={b}
                        favorites = {favorites}
                        membership={"none"}
                        userId = {userId}
                        setIsModal={setIsModal}
                        setModalTitle={setModalTitle}
                        setSelectedBoard={setSelectedBoard}
                        setOpen={setOpen}
                        key={b.uid}
                        handleFavoriteUpdate={handleFavoriteUpdate}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div></div>
          )}
          {closedBoards ? (
            <div className="mb-2 accordion-item">
              <h2 className="accordion-header" id="panelsStayOpen-headingThree">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapseFour"
                  aria-expanded="false"
                  aria-controls="panelsStayOpen-collapseFour"
                >
                  Closed Boards
                </button>
              </h2>
              <div
                id="panelsStayOpen-collapseFour"
                className="accordion-collapse collapse"
                aria-labelledby="panelsStayOpen-headingFour"
              >
                <div className="accordion-body">
                  <div className="mx-2 mt-2 d-flex flex-wrap">
                    {closedBoards.length === 0 ? (
                      <p>No Closed Boards</p>
                    ) : (
                      closedBoards.map((b) => (
                        <BoardListComponent
                          board={b}
                          userId = {userId}
                          favorites = {favorites}
                          membership={"none"}
                          setIsModal={setIsModal}
                          setModalTitle={setModalTitle}
                          setSelectedBoard={setSelectedBoard}
                          setOpen={setOpen}
                          handleFavoriteUpdate={handleFavoriteUpdate}
                          key={b.uid}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div></div>
          )}

          {favorites ? (
            <div className="mb-2 accordion-item">
              <h2 className="accordion-header" id="panelsStayOpen-headingThree">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapseFive"
                  aria-expanded="false"
                  aria-controls="panelsStayOpen-collapseFive"
                >
                  Favorite Boards
                </button>
              </h2>
              <div
                id="panelsStayOpen-collapseFive"
                className="accordion-collapse collapse"
                aria-labelledby="panelsStayOpen-headingFive"
              >
                <div className="accordion-body">
                  <div className="mx-2 mt-2 d-flex flex-wrap">
                    {favorites.length === 0 ? (
                      <p>No Favorited Boards</p>
                    ) : (
                      favorites.map((b) => (
                        <BoardListComponent
                          board={b}
                          userId = {userId}
                          favorites = {favorites}
                          membership={"none"}
                          setIsModal={setIsModal}
                          setModalTitle={setModalTitle}
                          setSelectedBoard={setSelectedBoard}
                          setOpen={setOpen}
                          handleFavoriteUpdate={handleFavoriteUpdate}
                          key={b.uid}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div></div>
          )}
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
        ) : (
          <></>
        )}
      </ModalComponent>
    </div>
  );
};

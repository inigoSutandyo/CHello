import React, { useEffect } from "react";
import { useState } from "react";
import {
  addNewWorkspace,
  usePublicWorkspace,
  useWorkspace,
} from "../../../controller/WorkspaceController";
import { LoadingComponent } from "../../components/LoadingComponent";
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

  const {workspaces, fixedWorkspaces} = useWorkspace(sessionUser, updater, searchWorkspace);
  const publicWorkspaces = usePublicWorkspace(fixedWorkspaces, searchWorkspace)
  return (
    <>
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

        </div>
      )}
    </>
  );
};

import React from "react";
import { inviteUser } from "../../../controller/InviteController";
import { useWorkspaceUsers } from "../../../controller/WorkspaceController";
import { VscAdd } from "react-icons/vsc";
import { MemberComponent } from "../MemberComponent";
import {CopyToClipboard} from 'react-copy-to-clipboard';

export const WorkspaceMemberComponent = ({
  workSpace,
  userId,
  handleMembershipChange,
  handleUserRemoval,
  membership,
}) => {
  const { admins, members } = useWorkspaceUsers(workSpace);

  return (
    <div className="m-2">
      <h5>Admins</h5>
      {admins.length === 0 ? (
        <p>No Admins</p>
      ) : (
        <div className="mb-5 d-flex flex-column">
          {admins.map((u) => (
            <div key={u.uid}>
              <MemberComponent
                user={u}
                membership={membership}
                handleMembershipChange={handleMembershipChange}
                handleUserRemoval={handleUserRemoval}
                buttonText={"To Member"}
                currentId = {userId}
              />
              <hr
                style={{
                  width: "100%",
                }}
              />
            </div>
          ))}
        </div>
      )}
      <h5>Members</h5>
      {members.length === 0 ? (
        <p>No Members</p>
      ) : (
        <div className="d-flex flex-column">
          <h5>Members</h5>
          {members.map((u) => (
            <div key={u.uid}>
              <MemberComponent
                user={u}
                membership={membership}
                handleMembershipChange={handleMembershipChange}
                handleUserRemoval={handleUserRemoval}
                buttonText={"To Admin"}
                currentId = {userId}
              />
              <hr
                style={{
                  width: "100%",
                }}
              />
            </div>
          ))}
        </div>
      )}
      {membership === "admin" ? (
        <>
          <div className="row g-2 mx-2 mt-5 p-1">
            <div className="col-auto">
              <input
                required
                type="email"
                className="form-control"
                name="memberEmail"
                id="memberEmail"
                placeholder="Add Member"
              />
            </div>
            <div className="col-auto">
              <button
                type="submit"
                className="btn btn-primary mb-3 px-2 py-1"
                onClick={() => {
                  const memberEmail = document.getElementById("memberEmail").value;
                  console.log(workSpace.uid);
                  inviteUser(
                    userId,
                    memberEmail,
                    workSpace.uid,
                    "workspaces",
                    "member"
                  );
                  document.getElementById("memberEmail").value = "";
                }}
              >
                <VscAdd />
              </button>
            </div>
          </div>
          <div className="row g-2 mx-2 p-1">
              <div className="col-auto"> 
                <CopyToClipboard text={`localhost:3000/joinws/${workSpace.uid}`}>
                  <button className="btn btn-outline-info">
                    Get Invite Link
                  </button>
                </CopyToClipboard>
              </div>
          </div>
        </>
      ) : <></>}
    </div>
  );
};

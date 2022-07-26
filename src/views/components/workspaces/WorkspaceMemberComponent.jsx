import { doc } from "firebase/firestore";
import React from "react";
import { inviteUser } from "../../../controller/InviteController";
import { useWorkspaceUsers } from "../../../controller/WorkspaceController";
import { VscAdd } from "react-icons/vsc";
import { FaWindowClose } from "react-icons/fa";
import { IconContext } from "react-icons/lib";

export const WorkspaceMemberComponent = ({
  workSpace,
  userId,
  handleMembershipChange,
  handleUserRemoval,
}) => {
  const { admins, members } = useWorkspaceUsers(workSpace);

  //   if (users.length != 0) {
  //     console.log(users)
  //   } else {
  //     console.log("Empty = ")
  //     console.log(users)
  //   }

  return (
    <div className="m-2">
      <h5>Admins</h5>
      {admins.length === 0 ? (
        <p>No Admins</p>
      ) : (
        <div className="mb-5 d-flex flex-column">
          {admins.map((u) => (
            <div key={u.uid}>
              <div className="d-flex justify-content-between align-items-center">
                <div>{u.email}</div>
                <div className="d-flex">
                  <button
                    type="button"
                    className="btn btn-success me-3"
                    onClick={() => handleMembershipChange(u.uid)}
                  >
                    To Member
                  </button>
                  <div style={{ cursor: "pointer" }} onClick={() => handleUserRemoval(u.uid)}>
                    <IconContext.Provider
                      value={{ color: "red", size: "30px" }}
                    >
                      <FaWindowClose />
                    </IconContext.Provider>
                  </div>
                </div>
              </div>
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
              <div className="d-flex justify-content-between align-items-center">
                <div>{u.email}</div>
                <div className="d-flex">
                  <button
                    type="button"
                    className="btn btn-warning me-3"
                    onClick={() => handleMembershipChange(u.uid)}
                  >
                    To Admin
                  </button>
                  <div style={{ cursor: "pointer" }} onClick={() => handleUserRemoval(u.uid)}>
                    <IconContext.Provider
                      value={{ color: "red", size: "30px" }}
                    >
                      <FaWindowClose />
                    </IconContext.Provider>
                  </div>
                </div>
              </div>
              <hr
                style={{
                  width: "100%",
                }}
              />
            </div>
          ))}
        </div>
      )}
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
    </div>
  );
};

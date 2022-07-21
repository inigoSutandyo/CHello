import { doc } from 'firebase/firestore'
import React from 'react'
import { inviteUser } from '../../controller/InviteController'
import { useWorkspaceUsers } from '../../controller/WorkspaceController'
import { VscAdd } from "react-icons/vsc"; 

export const WorkspaceMemberComponent = ({workSpace, userId}) => {
  const {admins, members} = useWorkspaceUsers(workSpace)

//   if (users.length != 0) {
//     console.log(users)
//   } else {
//     console.log("Empty = ")
//     console.log(users)
//   }
  
  return (
    <div>
        {admins.length === 0 ? <p>No Admins</p> : (
            <div>
              <h5>Admins</h5>
              {admins.map((u)=> 
                  <div key={u.uid}>
                      <p>{u.role} {u.name}</p>
                  </div>
              )}
            </div>
        )}
        {members.length === 0 ? <p>No Members</p> : (
            <div>
              <h5>Members</h5>
              {members.map((u)=> 
                  <div key={u.uid}>
                      <p>{u.role} {u.name}</p>
                  </div>
              )}
            </div>
        )}
        <div className="row g-2 mx-2 mt-5 p-1" >
            <div className="col-auto">
                <input required type="email" className="form-control" name="memberEmail" id="memberEmail" placeholder="Add Member"/>
            </div>
            <div className="col-auto">
                <button type="submit" className="btn btn-primary mb-3 px-2 py-1" onClick={( () => {
                  const memberEmail = document.getElementById("memberEmail").value
                  console.log(workSpace.uid)
                  inviteUser(userId,memberEmail,workSpace.uid,"workspaces","member")
                  document.getElementById("memberEmail").value = ""
                })}>
                    <VscAdd/>
                </button>
            </div>
        </div>
    </div>
  )
}

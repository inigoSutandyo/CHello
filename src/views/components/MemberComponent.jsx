import React from 'react'
import { FaWindowClose } from "react-icons/fa";
import { IconContext } from "react-icons/lib";

export const MemberComponent = ({membership, user, handleMembershipChange, handleUserRemoval, buttonText, currentId}) => {
  return (
    <div className="d-flex justify-content-between align-items-center">
        <div>{user.email}</div>
        {membership == "admin" && user.uid != currentId ? (
            <div className="d-flex">
                <button
                    type="button"
                    className="btn btn-success me-3"
                    onClick={() => handleMembershipChange(user.uid)}
                >
                    {buttonText}
                </button>
                <div style={{ cursor: "pointer" }} onClick={() => handleUserRemoval(user.uid)}>
                    <IconContext.Provider
                        value={{ color: "red", size: "30px" }}
                    >
                        <FaWindowClose />
                    </IconContext.Provider>
                </div>
            </div>
        ) : <></>}
    </div>
  )
}

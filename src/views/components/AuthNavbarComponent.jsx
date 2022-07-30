import React from 'react'
import { logoutAuth } from '../../controller/UserController'
import { useNavigate } from "react-router-dom";
export const AuthNavbarComponent = (props) => {

  // let navigate = useNavigate();

  return (
    <>
      <a className="nav-link" href="/profile">Hello, {props.email}</a>
        <a className="nav-link active" aria-current="page" href="/workspace">Workspace</a>
        <a className="nav-link" href='/invitations'>Notifications</a>
        <a className="nav-link" href='/login' onClick={() => {
          logoutAuth()
        }}>Logout</a>
    </>
  )
}

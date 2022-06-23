import React from 'react'
import { logoutAuth } from '../../controller/UserController'
import { useNavigate } from "react-router-dom";
export const AuthNavbarComponent = (props) => {

  // let navigate = useNavigate();

  return (
    <>
      <a className="nav-link" href="/register">Hello, {props.email}</a>
        <a className="nav-link active" aria-current="page" href="/login">Workspace</a>
        <a className="nav-link" href='/' onClick={() => {
          logoutAuth()
        }}>Logout</a>
    </>
  )
}

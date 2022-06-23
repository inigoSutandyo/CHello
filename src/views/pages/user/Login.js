import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { loginAuth } from '../../../controller/UserController';
import { ErrorComponent } from '../../components/ErrorComponent';

export const Login = () => {
  let navigate = useNavigate();

  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setIsError(errorMsg == "" ? false : true)
  }, [errorMsg])

  return (
    <div className='m-5'>
        <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" id="email" placeholder="name@example.com"/>
        </div>
        <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" id="password"/>
        </div>

        <div className='d-flex justify-content-center'>
            <button className='btn btn-primary' onClick={() => {
              let email = document.getElementById('email').value
              let password = document.getElementById('password').value
              loginAuth(email, password).then((data) => {
                if (data != "") {
                  setErrorMsg(data)
                } else {
                  navigate('/')
                }
              })
            }}>Login</button>
        </div>
        {isError && <ErrorComponent msg={errorMsg}/>}
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import {registerAuth} from '../../../controller/UserController'
import { useNavigate } from "react-router-dom";
import { ErrorComponent } from '../../components/ErrorComponent';

export const Register = () => {

  let navigate = useNavigate();

  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsError(errorMsg === "" ? false : true)
  }, [errorMsg])
  

  return (
    <>
        {!isLoading ? (
                <div className='m-5'>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input type="email" className="form-control" id="email" placeholder="name@example.com"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control" id="password"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="confirm" className="form-label">Confirm Password</label>
                        <input type="password" className="form-control" id="confirm"/>
                    </div>
                    <div className='d-flex justify-content-center'>
                        <button className='btn btn-primary' onClick={() => {
                            setIsLoading(true)
                            let email = document.getElementById('email').value.trim()
                            let password = document.getElementById('password').value.trim()
                            let confirm = document.getElementById('confirm').value.trim()
                            registerAuth(email, password, confirm).then(function(data) {
                                setIsLoading(false)
                                if (data !== "") {
                                    setErrorMsg(data)
                                } else {
                                    navigate('/')
                                }
                            })
                        }}>Register Now</button>
                    </div>
                    {isError && <ErrorComponent msg={errorMsg}/>}
                </div>
            ) : 
            <div>
                <div className="spinner">
                    <div className="bounce1"></div>
                    <div className="bounce2"></div>
                    <div className="bounce3"></div>
                </div>
            </div>
        }
    </>
  )
}

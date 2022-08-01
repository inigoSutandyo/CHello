import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { joinBoard } from '../../../controller/BoardController';
import {loginGetId } from '../../../controller/UserController';
import { ErrorComponent } from '../../components/ErrorComponent';
import { LoadingComponent } from '../../components/LoadingComponent';

export const JoinBoardPage = ({userSession}) => {
  let navigate = useNavigate();
  const {boardId} = useParams()
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsError(errorMsg === "" ? false : true)
  }, [errorMsg])

  return (
    <>
      {!isLoading ? (
        userSession ? (
            <>
                <button className='btn btn-outline-primary' onClick={() => {
                    joinBoard(boardId, userSession.uid).then(() => {
                        navigate(`/board/${boardId}`)
                    })
                }}>Click Here to Join Board</button>
            </>
        ) : (
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
                        setIsLoading(true)
                        let email = document.getElementById('email').value
                        let password = document.getElementById('password').value
                        loginGetId(email, password).then((data) => {
                        
                            if (data.error) {
                                setErrorMsg(data.msg)
                                setIsLoading(false)
                            } else {
                                console.log(data.uid)
                                joinBoard(boardId, data.uid).then(() => {
                                    navigate(`/board/${boardId}`)
                                    setIsLoading(false)
                                })
                            }
                        })
                    }}>Login</button>
                </div>
                {isError && <ErrorComponent msg={errorMsg}/>}
            </div>
        )
      ) : 
        <LoadingComponent/>
    }

  </>
  )
}

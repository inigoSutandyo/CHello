import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { loginAuth, loginGetId } from '../../../controller/UserController';
import { joinWorkspace } from '../../../controller/WorkspaceController';
import { ErrorComponent } from '../../components/ErrorComponent';
import { LoadingComponent } from '../../components/LoadingComponent';

export const JoinWorkspacePage = ({userSession}) => {
  let navigate = useNavigate();
  const {workspaceId} = useParams()
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
                    joinWorkspace(userSession.uid, workspaceId).then(() => {
                        navigate(`/workspace/${workspaceId}`)
                    })
                }}>Click Here to Join Workspace</button>
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
                                joinWorkspace(data.uid, workspaceId).then(() => {
                                    navigate(`/workspace/${workspaceId}`)
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

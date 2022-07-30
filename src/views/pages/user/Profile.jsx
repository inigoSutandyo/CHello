import React from 'react'
import { useState } from 'react'
import { changePassword, updateUser, updateUserDescription, updateUserDOB, useUser } from '../../../controller/UserController'
import { LoadingComponent } from '../../components/LoadingComponent'
import parse from "html-react-parser";
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { ErrorComponent } from '../../components/ErrorComponent';

export const Profile = ({userId}) => {
    const [updater, setUpdater] = useState(0)
    const [password, setPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const user = useUser(userId, updater)
  return (
    <div className='m-5'>
        <h3>Profile</h3>
        <div className="d-flex justify-content-start mb-3">
            <div onClick={() => {
              navigate(-1)
            }} style={{
              cursor: "pointer"
            }}>
              <FaArrowLeft/>
            </div>
        </div>
        {user && !loading ? (
            <div>
                <fieldset disabled >
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input type="email" className="form-control" id="email" defaultValue={user.email}/>
                    </div>
                </fieldset>

                <div className='mb-3'>
                    <label htmlFor="desc-div">Description</label>
                    <div 
                        contentEditable 
                        className="form-control h-100"
                        id="desc-div"
                        suppressContentEditableWarning={true}
                    >
                        {user.description ? parse(user.description) : <></>}
                    </div>
                </div>

                <div className="mb-3">
                    <label htmlFor="date" className="form-label">Date of Birth</label>
                    <input type="date" className="form-control" id="date" defaultValue={user.date_birth ? user.date_birth : null}/>
                </div>

                <div className='mb-3'>
                    <label htmlFor="privacy">Privacy</label>
                    <select className="form-select" aria-label="Privacy" id='privacy' defaultValue={user.privacy ? user.privacy : "public"}>
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>
                </div>

                <div className='mb-4'>
                <label htmlFor="frequency">Notification Frequency</label>
                    <select className="form-select" aria-label="NotifFreq" id='frequency' defaultValue={user.frequency ? user.frequency : "always"}>
                        <option value="always">Always</option>
                        <option value="periodically">Periodically</option>
                        <option value="never">Never</option>
                    </select>
                </div>
    
                <div className='d-flex flex-column'>
                    <div className='mb-3'>
                        <button className='btn btn-outline-primary w-25' onClick={() => {
                            setLoading(true)
                            const privacy = document.getElementById("privacy").value
                            const frequency = document.getElementById('frequency').value
                            const description = document.getElementById("desc-div").innerHTML
                            const dob = document.getElementById("date").value ? new Date(document.getElementById("date").value) : null

                            updateUser(userId, dob, description, privacy, frequency).then(() => {
                                setUpdater(updater+1)
                                setLoading(false)
                            })
                        }}>Save Profile</button>
                    </div>
                    
                    <div className='mb-3'>
                        <button className='btn btn-outline-danger w-25' onClick={() => {
                            // console.log(error)
                            setPassword(!password)
                        }}>{!password ? "Change Password" : "Cancel"}</button>
                    </div>
                </div>
                {password ? (
                    <>
                        <div className="mb-3">
                            <label htmlFor="oldpass" className="form-label">Old Password</label>
                            <input type="password" className="form-control" id="oldpass"/>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="newpass" className="form-label">New Password</label>
                            <input type="password" className="form-control" id="newpass"/>
                        </div>
                        <div className='d-flex justify-content-center'>
                            <div className='mb-3'>
                                <button className='btn btn-outline-secondary' onClick={() => {
                                    const oldpass = document.getElementById('oldpass').value
                                    const newpass = document.getElementById('newpass').value
                                    setLoading(true)
                                    if (!oldpass || !newpass) setError("Fields cannot be empty!")
                                    else if (oldpass === newpass || newpass === user.oldpass) setError("Old Password and New Password cannot be the same")
                                    else {
                                        changePassword(user.email, newpass, oldpass, userId, setLoading, setError, setPassword)
                                    }
                                }}>Save New Password</button>
                            </div>
                        </div>
                        {error === "" || !error ? <></> : <ErrorComponent msg={error}/>}
                    </>
                ) : <></>}
            </div>
        ) : <LoadingComponent/>}

    </div>
  )
}

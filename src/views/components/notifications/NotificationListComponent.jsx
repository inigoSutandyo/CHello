import React from 'react'
import { acceptInvite, destroyNotification, destroyInvite } from '../../../controller/InviteController'

export const NotificationListComponent = ({notifs}) => {
  return (
    <div className='m-1'>
        {!notifs || notifs.length === 0 ? <p>No Notifications</p> : (
            notifs.map(i => 
                <div className="card" key={i.uid}>
                    <h5 className="card-header">Notification</h5>
                    <div className="card-body">
                        <p className="card-text">{i.message}</p>
                        <a className="btn btn-danger" onClick={()=> {
                          destroyNotification(i.uid)
                        }}>Close</a>
                    </div>
              </div>
            )
        )}
    </div>
  )
}

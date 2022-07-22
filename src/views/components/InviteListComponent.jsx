import React from 'react'
import { acceptInvite, destroyInvite } from '../../controller/InviteController'

export const InviteListComponent = ({invites}) => {
  return (
    <div>
        {!invites || invites.length === 0 ? <p>No Invites</p> : (
            invites.map(i => 
                <div className="card" key={i.uid}>
                    <h5 className="card-header">Invitation</h5>
                    <div className="card-body">
                        <h5 className="card-title">From : {i.sourceEmail}</h5>
                        <p className="card-text">Invited you to his {i.spaceType}</p>
                        <a className="btn btn-primary" onClick={()=> {
                          acceptInvite(i.spaceRef, i.destinationRef, i.uid, i.memberType)
                        }}>Accept</a>
                        <a className="btn btn-danger" onClick={()=> {
                          destroyInvite(i.uid)
                        }}>Decline</a>
                    </div>
              </div>
            )
        )}
    </div>
  )
}

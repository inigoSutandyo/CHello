import React, { useEffect } from 'react'
import { useState } from 'react'
import { useInvite } from '../../../controller/InviteController'
import { InviteListComponent } from '../../components/notifications/InviteListComponent'

export const NotificationPage = ({userId}) => {
  const [updater, setUpdater] = useState(0)
  const invites = useInvite(userId, updater)

  return (
    <div>
        <h3>Invitations</h3>
        <InviteListComponent invites={invites}/>
    </div>
  )
}

import React, { useEffect } from 'react'
import { useState } from 'react'
import { useInvite, useNotification } from '../../../controller/InviteController'
import { InviteListComponent } from '../../components/notifications/InviteListComponent'
import { NotificationListComponent } from '../../components/notifications/NotificationListComponent'

export const NotificationPage = ({userId}) => {
  
  const [updater, setUpdater] = useState(0)
  const invites = useInvite(userId, updater)
  const notifications = useNotification(userId, updater)
  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     setUpdater(updater + 1);
  //   }, 10000);

  //   return () => clearInterval(intervalId);
  // }, [invites]);

  useEffect(() => {
    setUpdater(updater+1)
  }, [userId])

  return (
    <div className='m-3'>
        <h3>Invites</h3>
        <InviteListComponent invites={invites}/>
        <h3>Notifications</h3>
        <NotificationListComponent notifs={notifications}/>
    </div>
  )
}

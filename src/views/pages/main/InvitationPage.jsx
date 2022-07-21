import React from 'react'
import { useInvite } from '../../../controller/InviteController'
import { InviteListComponent } from '../../components/InviteListComponent'

export const InvitationPage = ({userId}) => {
  const invites = useInvite(userId)
  return (
    <div>
        <h3>Invitations</h3>
        <InviteListComponent/>
    </div>
  )
}

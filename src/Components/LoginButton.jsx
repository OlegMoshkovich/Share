import React from 'react'
import {useAuth0} from '@auth0/auth0-react'
import {TooltipIconButton} from './Buttons'
import GitHubIcon from '@mui/icons-material/GitHub'
// import LoginIcon from '../assets/icons/Login.svg'


const LoginButton = ({
  title = 'Log in with GitHub',
  placement = 'right',
  ...props
}) => {
  const {loginWithRedirect} = useAuth0()

  const onClick = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: window.location.pathname,
      },
    })
  }

  return (
    <TooltipIconButton
      title={'Log in with GitHub Account'}
      icon={<GitHubIcon style={{width: '23px', height: '23px'}}/>}
      onClick={onClick}
    />
  )
}

export default LoginButton

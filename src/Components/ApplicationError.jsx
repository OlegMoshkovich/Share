import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import useTheme from '@mui/styles/useTheme'
import Logo from '../assets/LogoB.svg'


const ApplicationError = () => {
  const theme = useTheme()
  return (
    <Box p={4} mx={'auto'}
      sx={{
        width: 400,
        bgcolor: theme.palette.scene.background,
        borderRadius: '10px',
      }}
    >
      <Typography variant={'body1'} sx={{color: theme.palette.primary.main, fontWeight: 600}}>
        Oh no!
      </Typography>

      <Typography variant={'body1'} sx={{color: theme.palette.secondary.main, fontWeight: 1000}}>
        We&apos;re not quite sure what went wrong.
      </Typography>

      <Typography variant={'body1'} sx={{pb: 2, color: theme.palette.secondary.main}}>
        Not to worry.<br/>
        You can <a href="/">click here to start a new session</a>.
      </Typography>

      <Box>
        <a href="/"><Logo style={{width: '30px'}}/></a>
      </Box>
    </Box>
  )
}

export default ApplicationError

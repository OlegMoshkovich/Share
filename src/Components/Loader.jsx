import React, {useState, useContext} from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import {ColorModeContext} from '../Context/ColorMode'
import AttentionIcon from '../assets/2D_Icons/Attention.svg'


/** @return {object} React component. */
export default function Loader({loader = true}) {
  const [loading, setLoading] = useState(loader)
  const theme = useContext(ColorModeContext).getTheme()
  const loadingPeriod = 10000
  if (loading) {
    setTimeout(function() {
      setLoading(false)
    }, loadingPeriod)
  }
  return (
    <Box sx={{width: '100%'}}>
      {loading ?
        <LinearProgress color="success" sx={{height: '16px', width: '100%', borderRadius: '5px'}}/> :
        <Box sx={{
          'display': 'flex',
          'flexDirection': 'column',
          'justifyContent': 'center',
          'alignItems': 'center',
          '& svg': {
            width: '30px',
            height: '30px',
            fill: theme.palette.highlight.secondary,
          },
        }}
        >
          <Box>
            <AttentionIcon/>
          </Box>
          <Typography variant={'h4'}> No Content </Typography>
        </Box>
      }
    </Box>
  )
}

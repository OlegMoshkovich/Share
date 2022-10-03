import React, {useState, useContext} from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import {ColorModeContext} from '../Context/ColorMode'
import AttentionIcon from '../assets/2D_Icons/Attention.svg'


/**
 * Loader contains the ItemPanel and allows for
 * show/hide from the right of the screen.
 *
 * @param {loaderOn} boolen dictates id the loader starts with linearLoader present
 * @param {duration} number seconds until no content sign appears
 * @return {object} React component.
 */
export default function Loader({loaderOn = true, duration = 10000}) {
  const [loading, setLoading] = useState(loaderOn)
  const theme = useContext(ColorModeContext).getTheme()
  if (loading) {
    setTimeout(function() {
      setLoading(false)
    }, duration)
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

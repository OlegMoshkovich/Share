import React, {useContext} from 'react'
import ButtonGroup from '@mui/material/ButtonGroup'
import Divider from '@mui/material/Divider'
import {makeStyles} from '@mui/styles'
import AboutControl from './AboutControl'
import CameraControl from './CameraControl'
import CutPlaneMenu from './CutPlaneMenu'
import ClearIcon from '../assets/2D_Icons/Clear.svg'
import ListIcon from '../assets/2D_Icons/List.svg'
import MoonIcon from '../assets/2D_Icons/Moon.svg'
import NotesIcon from '../assets/2D_Icons/Notes.svg'
import ShareControl from './ShareControl'
import SunIcon from '../assets/2D_Icons/Sun.svg'
import TreeIcon from '../assets/2D_Icons/Tree.svg'
import useStore from '../store/useStore'
import {ColorModeContext} from '../Context/ColorMode'
import {TooltipIconButton} from './Buttons'
import {useIsMobile} from './Hooks'


/**
 * OperationsGroup contains tools for cut plane, deselecting items and
 * toggling shortcut visibility
 *
 * @param {object} viewer The IFC viewer
 * @param {Function} unSelectItem deselects currently selected element
 * @return {React.Component}
 */
export default function OperationsGroup({unSelectItem, installPrefix, fileOpen, showNavPanel, onClickMenuCb}) {
  const turnCommentsOn = useStore((state) => state.turnCommentsOn)
  const toggleIsPropertiesOn = useStore((state) => state.toggleIsPropertiesOn)
  const openDrawer = useStore((state) => state.openDrawer)
  const isCommentsOn = useStore((state) => state.isCommentsOn)
  const isPropertiesOn = useStore((state) => state.isPropertiesOn)
  const viewer = useStore((state) => state.viewerStore)
  const selectedElement = useStore((state) => state.selectedElement)
  const isMobile = useIsMobile()
  const classes = useStyles({isCommentsOn: isCommentsOn})
  const theme = useContext(ColorModeContext)


  const toggle = (panel) => {
    openDrawer()
    if (panel === 'Properties') {
      toggleIsPropertiesOn()
    }
    if (panel === 'Notes') {
      turnCommentsOn()
    }
  }


  return (
    <div className={classes.container}>
      <ButtonGroup orientation="vertical" >
        <ShareControl viewer={viewer}/>
      </ButtonGroup>
      {!isMobile && <Divider />}
      <ButtonGroup orientation="vertical" >
        <TooltipIconButton
          title='Notes'
          icon={<NotesIcon/>}
          selected={isCommentsOn}
          onClick={() => toggle('Notes')}
        />
        <TooltipIconButton
          title="Properties"
          onClick={() => toggle('Properties')}
          selected={isPropertiesOn}
          icon={<ListIcon/>}
        />
        {isMobile &&
          <TooltipIconButton
            title='Elements Hierarchy'
            selected={showNavPanel}
            onClick={onClickMenuCb}
            icon={<TreeIcon/>}
          />
        }
        <CutPlaneMenu/>
        <TooltipIconButton
          title="Clear"
          onClick={unSelectItem}
          selected={selectedElement !== null}
          icon={<ClearIcon />}
        />
      </ButtonGroup>
      <Divider/>
      <ButtonGroup orientation="vertical">
        <TooltipIconButton
          title={`${theme.isDay() ? 'Night' : 'Day'} theme`}
          onClick={() => theme.toggleColorMode()}
          icon={theme.isDay() ? <MoonIcon/> : <SunIcon/>}
        />
        <AboutControl installPrefix={installPrefix}/>
      </ButtonGroup>
      {/* Invisible */}
      <CameraControl viewer={viewer}/>
    </div>
  )
}


const useStyles = makeStyles({
  container: {
    // Actually want 100 - size of settings button
    'display': 'flex',
    'flexDirection': 'column',
    'height': 'calc(100vh - 40px)',
    'margin': '20px 20px 0 0',
    '@media (max-width: 900px)': {
      margin: '20px 10px 0 0',
    },
  },
})


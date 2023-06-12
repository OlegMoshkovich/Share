import React from 'react'
import Paper from '@mui/material/Paper'
import {TooltipIconButton} from './Buttons'
// import SaveModelControl from './SaveModelControl'
import useStore from '../store/useStore'
// import BranchIcon from '../assets/icons/Branch.svg'
// import SearchIcon from '../assets/icons/Search.svg'
// import OpenModelControl from './OpenModelControl'
// import StructureMenu from '../Components/StructureMenu'
// import TreeMenu from './TreeMenu'
import CutPlaneMenu from './CutPlaneMenu'
// import ExtractLevelsMenu from './ExtractLevelsMenu'
import StandardViewsMenu from './StandardViewsMenu'
import CaptureIcon from '../assets/icons/Capture.svg'
import {
  addCameraUrlParams,
  // removeCameraUrlParams,
} from './CameraControl'


/**
 * Controls group contains toggles for fileapth, branches, spatial navigation, and element type navigation
 *
 * @param {Function} modelPath object containing information about the location of the model
 * @return {React.Component}
 */
export default function ViewGroup({modelPath, isLocalModel, fileOpen}) {
  // const isBranches = useStore((state) => state.isBranches)
  // const isBranchControlVisible = useStore((state) => state.isBranchControlVisible)
  // const toggleIsBranchControlVisible = useStore((state) => state.toggleIsBranchControlVisible)
  // const isSearchBarVisible = useStore((state) => state.isSearchBarVisible)
  // const toggleIsSearchBarVisible = useStore((state) => state.toggleIsSearchBarVisible)
  const cameraControls = useStore((state) => state.cameraControls)
  const setSavedViews = useStore((state) => state.setSavedViews)
  const savedViews = useStore((state) => state.savedViews)

  const onCapture = () => {
    addCameraUrlParams(cameraControls)
    const url = window.location.href
    const viewUrls = savedViews.concat(url)
    setSavedViews(viewUrls)
  }

  return (
    <Paper
      elevation={1}
      variant='control'
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginLeft: '5px',
        borderRadius: '10px',
        opacity: .9,
      }}
    >
      <StandardViewsMenu/>
      <CutPlaneMenu/>
      {/* <ExtractLevelsMenu/> */}
      <TooltipIconButton
        title={'Capture view'}
        placement={'top'}
        icon={<CaptureIcon/>}
        onClick={() => {
          onCapture()
        }}
      />
    </Paper>
  )
}

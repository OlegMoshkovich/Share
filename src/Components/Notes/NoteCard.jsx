import React, {useState, useEffect} from 'react'
import {useAuth0} from '@auth0/auth0-react'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import {
  CardFooter,
  CardMenu,
  RegularCardBody,
  SelectedCardBody,
  CommentCardBody,
} from './NoteCardSupportComponents'
import EditCardBody from './EditCardBody'
import useStore from '../../store/useStore'
import {assertDefined, assertStringNotEmpty} from '../../utils/assert'
import {addHashParams, getHashParamsFromHashStr, removeHashParams} from '../../utils/location'
import {findUrls} from '../../utils/strings'
import {closeIssue, updateIssue, deleteComment, createComment, getIssueComments} from '../../utils/GitHub'
import {
  CAMERA_PREFIX,
  addCameraUrlParams,
  setCameraFromParams,
  parseHashParams,
  removeCameraUrlParams,
} from '../CameraControl'
import {NOTE_PREFIX} from './Notes'
import CheckIcon from '@mui/icons-material/Check'


/**
 * Note card
 *
 * @param {number} id note id
 * @param {number} index note index
 * @param {string} username username of the note author
 * @param {string} title note title
 * @param {string} avatarUrl user avatarUrl
 * @param {string} body note body
 * @param {string} date note date
 * @param {number} numberOfComments number of replies to the note - referred to as comments in GH
 * @param {boolean} expandedImage governs the size of the image, small proportions on mobile to start
 * @param {boolean} isComment Comments/replies are formatted differently
 * @return {object} React component
 */
export default function NoteCard({
  id = null,
  index = null,
  username = '',
  title = '',
  body = '',
  noteNumber = '',
  avatarUrl = '',
  date = '',
  numberOfComments = null,
  isNote = true,
  synched = true,
}) {
  assertDefined(id, index)
  const [anchorEl, setAnchorEl] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [editBody, setEditBody] = useState(body)
  const [commentBody, setCommentBody] = useState('')
  const [showCreateComment, setShowCreateComment] = useState(false)
  const accessToken = useStore((state) => state.accessToken)
  const comments = useStore((state) => state.comments)
  const cameraControls = useStore((state) => state.cameraControls)
  const notes = useStore((state) => state.notes)
  const repository = useStore((state) => state.repository)
  const setComments = useStore((state) => state.setComments)
  const setNotes = useStore((state) => state.setNotes)
  const setSelectedNoteId = useStore((state) => state.setSelectedNoteId)
  const setSelectedNoteIndex = useStore((state) => state.setSelectedNoteIndex)
  const setSnackMessage = useStore((state) => state.setSnackMessage)
  const selectedNoteId = useStore((state) => state.selectedNoteId)
  const {user} = useAuth0()
  const embeddedCameraParams = findUrls(body)
      .filter((url) => {
        if (url.indexOf('#') === -1) {
          return false
        }
        const encoded = getHashParamsFromHashStr(
            url.substring(url.indexOf('#') + 1),
            CAMERA_PREFIX)
        return encoded && parseHashParams(encoded)
      })
  const firstCamera = embeddedCameraParams[0] // Intentionally undefined if empty
  const dateParts = date.split('T')
  const open = Boolean(anchorEl)
  const selected = selectedNoteId === id

  useEffect(() => {
    setEditBody(body)
  }, [selectedNoteId, body])
  useEffect(() => {
    if (selected && firstCamera) {
      setCameraFromParams(firstCamera, cameraControls)
    }
  }, [selected, firstCamera, cameraControls])

  /** Selecting a card move the notes to the replies/comments thread. */
  function selectCard() {
    setSelectedNoteIndex(index)
    setSelectedNoteId(id)
    if (embeddedCameraParams) {
      setCameraFromParams(firstCamera)
    }
    removeHashParams(window.location, NOTE_PREFIX)
    addHashParams(window.location, NOTE_PREFIX, {id: id})
  }

  /** Moves the camera to the position specified in the url attached to the issue/comment.*/
  function showCameraView() {
    setCameraFromParams(firstCamera, cameraControls)
    addCameraUrlParams(cameraControls)
    if (!embeddedCameraParams) {
      removeCameraUrlParams()
    }
  }

  /** Copies the issue url which contains the issue id, camera position and selected element path.*/
  function shareIssue() {
    navigator.clipboard.writeText(window.location)
    setSnackMessage('The url path is copied to the clipboard')
    const pauseTimeMs = 5000
    setTimeout(() => setSnackMessage(null), pauseTimeMs)
  }


  /**
   * deletes the note
   *
   * @param {string} repository
   * @param {string} accessToken
   * @param {number} noteNumber obtained from github issue
   * @return {object} return github return object
   */
  async function deleteNote(noteNumberToDelete) {
    const closeResponse = await closeIssue(repository, noteNumberToDelete, accessToken)
    const updatedNotes = notes.filter((note) => note.number !== noteNumberToDelete)
    setNotes(updatedNotes)
    handleMenuClose()
    setSelectedNoteId(null)
    return closeResponse
  }

  const fetchComments = async () => {
    const newComments = []
    const commentArr = await getIssueComments(repository, noteNumber, accessToken)

    if (commentArr) {
      commentArr.map((comment) => {
        newComments.push({
          id: comment.id,
          body: comment.body,
          date: comment.created_at,
          username: comment.user.login,
          avatarUrl: comment.user.avatar_url,
          synched: true,
        })
      })
    }
    setComments(newComments)
  }


  /**
   * create new comment
   *
   * @param {string} repository
   * @param {string} accessToken
   * @param {number} commentId
   * @return {object} return github return object
   */
  async function createNewComment() {
    assertStringNotEmpty(body)
    const commentPayload = {
      body: commentBody || '',
    }
    await createComment(repository, noteNumber, commentPayload, accessToken)
    setCommentBody('')
    fetchComments()
  }

  /**
   * Remove comment
   *
   * @param {string} repository
   * @param {string} accessToken
   * @param {number} commentId
   * @return {object} return github return object
   */
  async function removeComment(commentId) {
    const newComments = comments.map((comment) => ({
      ...comment,
      synched: (comment.id !== commentId) && comment.synched,
    }))
    setComments(newComments)
    await deleteComment(repository, commentId, accessToken)
  }

  /** Triggerred when menu is closed*/
  function handleMenuClose() {
    setAnchorEl(null)
  }

  /** Triggerred when menu icon is activated*/
  function handleMenuClick(event) {
    setAnchorEl(event.currentTarget)
  }

  /** Activate note edit mode*/
  function actviateEditMode() {
    handleMenuClose()
    setEditMode(true)
  }

  /** Submit update*/
  async function submitUpdate() {
    const res = await updateIssue(repository, noteNumber, title, editBody, accessToken)
    const editedNote = notes.find((note) => note.id === id)
    editedNote.body = res.data.body
    setNotes(notes)
    setEditMode(false)
  }

  return (
    <Card
      elevation={1}
      variant='note'
      sx={{fontSize: '1em'}}
    >
      {!isNote &&
        <CardHeader
          avatar={<Avatar alt={username} src={avatarUrl}/>}
          subheader={<div>{username} at {dateParts[0]} {dateParts[1]}</div>}
        /> }
      {isNote &&
        <CardHeader
          title={title}
          avatar={<Avatar alt={username} src={avatarUrl}/>}
          subheader={<div>{username} at {dateParts[0]} {dateParts[1]}</div>}
          action={
            synched && user && user.nickname === username &&
          <CardMenu
            handleMenuClick={handleMenuClick}
            handleMenuClose={handleMenuClose}
            anchorEl={anchorEl}
            actviateEditMode={actviateEditMode}
            deleteNote={deleteNote}
            noteNumber={noteNumber}
            open={open}
          />
          }
        /> }
      {!editMode && isNote && !selected &&
       <RegularCardBody selectCard={selectCard} editBody={editBody}/>}
      {selected && !editMode && <SelectedCardBody editBody={editBody}/>}
      {!isNote && <CommentCardBody editBody={editBody}/>}
      {editMode &&
       <EditCardBody
         handleTextUpdate={(event) => setEditBody(event.target.value)}
         value={editBody}
       />
      }
      {showCreateComment &&
          <Box sx={{padding: '20px'}}>
            <TextField
              label="Enter your comment"
              variant="outlined"
              value={commentBody}
              size='small'
              multiline
              fullWidth
              onChange={(event) => setCommentBody(event.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={createNewComment}>
                      <CheckIcon/>
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
      }
      <CardFooter
        editMode={editMode}
        id={id}
        noteNumber={noteNumber}
        username={username}
        selectCard={selectCard}
        numberOfComments={numberOfComments}
        embeddedCameras={embeddedCameraParams}
        selected={selected}
        onClickCamera={showCameraView}
        onClickShare={shareIssue}
        removeComment={removeComment}
        isNote={isNote}
        synched={synched}
        submitUpdate={submitUpdate}
        setShowCreateComment={setShowCreateComment}
        showCreateComment={showCreateComment}
      />
    </Card>
  )
}

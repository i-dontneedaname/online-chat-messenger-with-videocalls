import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useInput } from '../../hooks/useInput';
import { fileToBlob } from '../../utils/fileToBlob'
import { changeSettings } from '../../store/actions/auth';
import SetupAvatar from '../UI/SetupAvatar/SetupAvatar';



const Settings = ({ isSettingsOpen, handleCloseSettings }) => {

	const dispatch = useDispatch()

	const { nickname, avatar } = useSelector(state => state.auth)

	const [localVarAvatar, setlocalVarAvatar] = useState(avatar)
	const localVarNickname = useInput(nickname)

	const onAvatarChange = async (event) => {
		if (event.target.files && event.target.files[0]) {
			const img = event.target.files[0]
			if (img.size < 750000) {
				const blob = await fileToBlob(img)
				setlocalVarAvatar(blob)
			}
		}
	}

	const resetAvatar = () => {
		setlocalVarAvatar(null)
	}

	const submitNewSettings = () => {
		if (localVarNickname.value.trim() === "") return

		dispatch(changeSettings({
			avatar: localVarAvatar,
			nickname: localVarNickname.value,
		}))

		handleCloseSettings()
	}

	return (

		<Dialog
			open={isSettingsOpen}
			onClose={handleCloseSettings}
			fullWidth
		>

			<DialogTitle>
				Your Personal Details
			</DialogTitle>

			<DialogContent>

				<SetupAvatar
					uploadedAvatar={localVarAvatar}
					resetAvatar={resetAvatar}
					onAvatarChange={onAvatarChange}
				/>

				<TextField
					margin="dense"
					id="nickname"
					label="Nickname"
					value={localVarNickname.value}
					onChange={localVarNickname.onChange}
					fullWidth
					error={localVarNickname.value === "".trim()}
					helperText={localVarNickname.value === "".trim() && 'Empty!'}
				/>

			</DialogContent>

			<DialogActions>
				<Button
					onClick={submitNewSettings}
					color="warning"
					disabled={(localVarAvatar === avatar && localVarNickname.value === nickname) || localVarNickname.value.trim() === ""}
				>
					Change
				</Button>
				<Button
					onClick={handleCloseSettings}
				>
					Cancel
				</Button>
			</DialogActions>
			
		</Dialog >

	)
}

export default Settings
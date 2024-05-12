import { Alert, Button, Container, Snackbar, TextField, Typography } from '@mui/material';
import React, { useState } from 'react'
import axios from 'axios';
import { user } from '../api/endpoint';

const UserProfile = (props) => {
    const [isEditable, setIsEditable] = useState(false);
    const [name, setName] = useState(props.name)
    const [email, setEmail] = useState(props.email)
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleEditToggle = () => {
        setIsEditable(!isEditable);
    };

    const editUsername = async (accessToken, isGoogleAuth) => {
        try {
            await axios.put(user, { newUsername: name, email }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            setSuccessMessage("Username updated successfully");
        } catch (error) {
            console.log(error)
            setErrorMessage("Failed to update username");
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        await editUsername(props.accessToken, props.isGoogleAuth)
        await props.getUserProfile(props.accessToken, props.isGoogleAuth)
    }

    return (
        <Container maxWidth="sm">
            <Typography variant="h6" align="center" gutterBottom>
                User Form
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Name"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!isEditable}
                />
                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled
                    sx={{ marginTop: '10px' }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={!isEditable}
                >
                    Save
                </Button>
            </form>
            <Button onClick={handleEditToggle}>
                {isEditable ? 'Cancel' : 'Edit'}
            </Button>

            <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={() => setSuccessMessage("")}>
                <Alert severity="success" onClose={() => setSuccessMessage("")}>
                    {successMessage}
                </Alert>
            </Snackbar>
            <Snackbar open={!!errorMessage} autoHideDuration={6000} onClose={() => setErrorMessage("")}>
                <Alert severity="error" onClose={() => setErrorMessage("")}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Container>
    )
}

export default UserProfile;

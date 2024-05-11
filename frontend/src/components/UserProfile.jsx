import { Button, Container, TextField, Typography } from '@mui/material';
import React, { useState } from 'react'
import { user, userInfo } from '../api/endpoint';
import axios from 'axios';

const UserProfile = (props) => {
    const [isEditable, setIsEditable] = useState(false);
    const [name, setName] = useState(props.name)
    const [email, setEmail] = useState(props.email)

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
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit = async () => {
        await editUsername(props.accessToken, props.isGoogleAuth)
        await props.getUserProfile(accessToken, isGoogleAuth)
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
        </Container>
    )
}

export default UserProfile
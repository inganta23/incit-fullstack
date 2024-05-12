import { Alert, Button, Container, Snackbar, TextField, Typography } from '@mui/material'
import axios from 'axios';
import React, { useState } from 'react'
import { resetPass } from '../api/endpoint';

const ResetPassword = (props) => {
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");


    const validatePassword = (password) => {
        const lowerCaseRegex = /[a-z]/;
        const upperCaseRegex = /[A-Z]/;
        const digitRegex = /[0-9]/;
        const specialCharRegex = /[$&+,:;=?@#|'<>.^*()%!-]/;
        const minLength = 8;

        if (
            !lowerCaseRegex.test(password) ||
            !upperCaseRegex.test(password) ||
            !digitRegex.test(password) ||
            !specialCharRegex.test(password) ||
            password.length < minLength
        ) {
            return false;
        }

        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccessMessage("");

        if (newPassword !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }
        if (!validatePassword(newPassword)) {
            setError(
                'Password must contain at least one lower case character, one upper case character, one digit, one special character, and be at least 8 characters long.'
            );
            return;
        }
        try {
            await axios.put(resetPass, {
                email: props.email,
                password,
                newPassword
            }, {
                headers: {
                    Authorization: `Bearer ${props.accessToken}`
                }
            });
            setSuccessMessage("Password reset successful");
        } catch (error) {
            setErrorMessage(error.message);
        }
    };


    return (
        <>
            {props.isGoogleAuth ? <Typography variant="h6" align="center" gutterBottom>
                You are using google account. Please reset your password from google setting.
            </Typography> :
                <Container maxWidth="sm">
                    <Typography variant="h6" align="center" gutterBottom>
                        Reset Password
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Current Password"
                            fullWidth
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <TextField
                            label="New Password"
                            type="password"
                            fullWidth
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            sx={{ marginTop: '10px' }}
                        />
                        <TextField
                            label="Confirm Password"
                            type="password"
                            fullWidth
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            sx={{ marginTop: '10px' }}
                        />
                        {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                        >
                            Reset Password
                        </Button>
                    </form>
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
            }
        </>
    )
}

export default ResetPassword
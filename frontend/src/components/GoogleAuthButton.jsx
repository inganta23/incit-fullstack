import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { Button } from '@mui/material';

const GoogleAuthButton = (props) => {
    const handleGoogle = useGoogleLogin({
        onSuccess: (codeResponse) => props.handleSuccess(codeResponse),
        onFailure: (error) => {
            console.error('Google login failed:', error);
        },
        flow: 'auth-code',
    });

    return (
        <Button variant="contained" onClick={() => handleGoogle()}>{props.title}</Button>
    );
};

export default GoogleAuthButton;

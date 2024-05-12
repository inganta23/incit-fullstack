import React, { useState } from 'react';
import { TextField, Button, Container } from '@mui/material';
import { register } from '../api/endpoint';
import axios from 'axios';

const RegisterForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');

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
        setIsLoading(true);
        setError("")
        if (password !== confirmPassword) {
            setError("Passwords don't match");
            setIsLoading(false);
            return;
        }
        if (!validatePassword(password)) {
            setError(
                'Password must contain at least one lower case character, one upper case character, one digit, one special character, and be at least 8 characters long.'
            );
            setIsLoading(false);
            return;
        }
        try {
            await axios.post(register, {
                name,
                email,
                password
            });
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Name"
                    type="name"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <TextField
                    label="Email"
                    sx={{ marginTop: '10px' }}
                    type="email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <TextField
                    label="Password"
                    sx={{ marginTop: '10px' }}
                    type="password"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <TextField
                    label="Confirm Password"
                    sx={{ marginTop: '10px' }}
                    type="password"
                    fullWidth
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    {isLoading ? 'Loading...' : 'Sign Up'}
                </Button>
            </form>
        </Container>
    );
};

export default RegisterForm;

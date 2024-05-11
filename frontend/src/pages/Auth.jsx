import React, { useState } from 'react';
import axios from 'axios';
import GoogleAuthButton from "../components/GoogleAuthButton";
import { Box, Tab, Tabs, Typography } from '@mui/material';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import { registerGoogle, loginGoogle } from '../api/endpoint';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
    const navigate = useNavigate()
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    function CustomTabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: 3 }}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    const signup = async (codeResponse) => {
        try {
            const response = await axios.post(registerGoogle, {
                code: codeResponse.code,
            });
            document.cookie = `access_token=${response.data['access_token']}; path=/`;
            document.cookie = `refresh_token=${response.data['refresh_token']}; path=/`;
            document.cookie = `isgoogleauth=true; path=/`;
            navigate('/')
        } catch (error) {
            console.error('Error hitting API:', error);
        }
    }

    const login = async (codeResponse) => {
        try {
            const response = await axios.post(loginGoogle, {
                code: codeResponse.code,
            });
            document.cookie = `access_token=${response.data['access_token']}; path=/`;
            document.cookie = `refresh_token=${response.data['refresh_token']}; path=/`;
            document.cookie = `isgoogleauth=true; path=/`;
            navigate('/')
        } catch (error) {
            console.error('Error hitting API:', error);
        }
    }

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
        >
            <Box>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Sign in" {...a11yProps(0)} />
                        <Tab label="Sign up" {...a11yProps(1)} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    <Box sx={{ minHeight: 0, height: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <GoogleAuthButton title='Sign in with google' handleSuccess={login} />
                        <Typography variant="p" my={2}>
                            OR
                        </Typography>
                        <LoginForm />
                    </Box>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <Box sx={{ minHeight: 0, height: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <GoogleAuthButton title='Sign up with google' handleSuccess={signup} />
                        <Typography variant="p" my={2}>
                            OR
                        </Typography>
                        <RegisterForm />
                    </Box>
                </CustomTabPanel>
            </Box>
        </Box>
    )
}

export default Auth
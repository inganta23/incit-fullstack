import { AppBar, Button, Container, Toolbar, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import UserProfile from '../components/UserProfile'
import { userInfo, logout as logoutEndpoint } from '../api/endpoint'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import UserDatabaseTable from '../components/UserDatabaseTable'
import UserStatistics from '../components/UserStatistics'

const Dashboard = () => {
    const navigate = useNavigate()
    const [openProfile, setOpenProfile] = useState(false);
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [accessToken, setAccessToken] = useState("")
    const [isGoogleAuth, setIsGoogleAuth] = useState(false)

    function clearCookie(cookieName) {
        document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }

    const getUserProfile = async (accessToken, isGoogleAuth) => {
        try {
            const response = await axios.get(`${userInfo}${isGoogleAuth ? '?google=true' : ''}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setName(response.data?.user?.name);
            setEmail(response.data?.user?.email)
        } catch (error) {
            console.log(error)
        }
    };

    const logout = async () => {
        try {
            await axios.post(logoutEndpoint, { email }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            clearCookie("access_token");
            clearCookie("isgoogleauth");
            clearCookie("refresh_token");
            navigate("auth")
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        let accessTokenTemp = ""
        let isGoogleAuthTemp = ""
        const accessTokenCookie = document.cookie
            .split('; ')
            .find(row => row.startsWith('access_token='));
        const isGoogleAuthCookie = document.cookie
            .split('; ')
            .find(row => row.startsWith('isgoogleauth='));

        if (accessTokenCookie) accessTokenTemp = accessTokenCookie.split('=')[1];
        if (isGoogleAuthCookie) isGoogleAuthTemp = isGoogleAuthCookie.split('=')[1];
        getUserProfile(accessTokenTemp, isGoogleAuthTemp)
        setAccessToken(accessTokenTemp)
        setIsGoogleAuth(isGoogleAuthTemp)
    }, []);

    return (
        <>
            <AppBar position="static">
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6">My Dashboard</Typography>
                    <Button variant="contained" onClick={() => logout()}>Logout</Button>
                </Toolbar>
            </AppBar>
            <Container sx={{ marginTop: '20px', display: 'flex', alignItems: 'center', flexDirection: 'column', gap: '20px'}}>
                <Typography variant="h4">{`Welcome to the Dashboard ${name}!`}</Typography>
                <Button variant="contained" onClick={() => setOpenProfile(!openProfile)}>{`${openProfile ? 'Close' : 'Open'} user profile`}</Button>
                {openProfile && <UserProfile name={name} email={email} isGoogleAuth={isGoogleAuth} accessToken={accessToken} getUserProfile={getUserProfile}/>}
                {accessToken && <UserStatistics accessToken={accessToken} />}
                {accessToken && <UserDatabaseTable accessToken={accessToken}/>}
            </Container>

        </>
    )
}

export default Dashboard
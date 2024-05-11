import React, { useEffect, useState } from 'react';
import { Typography, Grid, Paper } from '@mui/material';
import axios from 'axios';
import { activeUsersTodayAPI, averageActiveUsersLast7DaysAPI, totalUsersAPI } from '../api/endpoint';

const UserStatistics = (props) => {
    const [totalUsers, setTotalUsers] = useState(0);
    const [activeUsersToday, setActiveUsersToday] = useState(0);
    const [averageActiveUsersLast7Days, setAverageActiveUsersLast7Days] = useState(0);
    const fetchStatistics = async () => {
        try {
            const [totalUsersResponse, activeUsersTodayResponse, averageActiveUsersLast7DaysResponse] = await Promise.all([
                axios.get(totalUsersAPI, {
                    headers: {
                        Authorization: `Bearer ${props.accessToken}`
                    }
                }),
                axios.get(activeUsersTodayAPI, {
                    headers: {
                        Authorization: `Bearer ${props.accessToken}`
                    }
                }),
                axios.get(averageActiveUsersLast7DaysAPI, {
                    headers: {
                        Authorization: `Bearer ${props.accessToken}`
                    }
                })
            ]);

            setTotalUsers(totalUsersResponse.data.totalUsers);
            setActiveUsersToday(activeUsersTodayResponse.data.activeUsersToday);
            setAverageActiveUsersLast7Days(averageActiveUsersLast7DaysResponse.data.averageActiveUsers);
        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    };

    useEffect(() => {
        fetchStatistics();
    }, []);

    return (
        <div>
            <Typography variant="h6" gutterBottom textAlign="center">User statistics</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper elevation={3} sx={{ padding: '20px', textAlign: 'center', minHeight: '150px' }}>
                        <Typography variant="h6">Total Users</Typography>
                        <Typography variant="h4">{totalUsers}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper elevation={3} sx={{ padding: '20px', textAlign: 'center', minHeight: '150px' }}>
                        <Typography variant="h6">Active Users Today</Typography>
                        <Typography variant="h4">{activeUsersToday}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper elevation={3} sx={{ padding: '20px', textAlign: 'center', minHeight: '150px' }}>
                        <Typography variant="h6">Average Active Users Last 7 Days</Typography>
                        <Typography variant="h4">{averageActiveUsersLast7Days?.toFixed(2)}</Typography>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
};

export default UserStatistics;

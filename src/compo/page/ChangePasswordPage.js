import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Card, CardContent, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from '../../App';
import APIConnection from '../../config';

const ChangePasswordPage = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { setIsAuthenticated } = React.useContext(AuthContext);
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUserId(decodedToken.id);
            } catch (error) {
                console.error('Invalid token:', error);
                Swal.fire('Error', 'Invalid session. Please log in again.', 'error');
                navigate('/'); // Redirect to login page
            }
        } else {
            Swal.fire('Error', 'No token found. Please log in again.', 'error');
            navigate('/'); // Redirect to login page
        }
    }, [navigate]);

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            Swal.fire('Error', 'Passwords do not match.', 'error');
            return;
        }

        try {
            const changepassresponse = await axios.post(APIConnection.changePasswordApi, { newPassword, userId });
            if (changepassresponse.status === 200) {
                Swal.fire('Success', 'Password changed successfully.', 'success');
                // setIsAuthenticated(true);
                localStorage.clear();
                navigate('/dashboard');
            }

        } catch (error) {
            console.error('Password change error:', error);
            Swal.fire('Error', 'Failed to change password. Please try again.', 'error');
        }
    };

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            bgcolor="#f5f5f5"
            p={2}
        >
            <Card sx={{ maxWidth: 500, width: '100%', boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h5" component="h2" align="center" gutterBottom>
                        Change Password
                    </Typography>
                    <Typography variant="body2" color="textSecondary" align="center" mb={2}>
                        Please enter your new password below.
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="New Password"
                                type="password"
                                variant="outlined"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Confirm New Password"
                                type="password"
                                variant="outlined"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={handleChangePassword}
                                sx={{
                                    padding: 1.5,
                                    mt: 2,
                                    backgroundColor: '#007bff',
                                    '&:hover': {
                                        backgroundColor: '#0056b3',
                                    },
                                }}
                            >
                                Change Password
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};

export default ChangePasswordPage;

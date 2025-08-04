// src/pages/Login.jsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import { Email, Lock } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [firebaseError, setFirebaseError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    setFirebaseError('');
  };

  const validate = () => {
    const tempErrors = {};
    if (!formData.email.trim()) tempErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = 'Invalid email';
    if (!formData.password) tempErrors.password = 'Password is required';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;
  setIsSubmitting(true);
  setFirebaseError('');
  try {
    await signInWithEmailAndPassword(auth, formData.email, formData.password);
    setSuccessAlert(true);
    setTimeout(() => navigate('/dashboard'), 2000);
  } catch (error) {
  let friendlyMessage = 'Something went wrong. Please try again.';

  switch (error.code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-email':
    case 'auth/invalid-credential': // ✅ Important
      friendlyMessage = 'Invalid email or password. Please try again.';
      break;

    case 'auth/user-disabled':
      friendlyMessage = 'Your account has been disabled. Please contact support.';
      break;

    case 'auth/too-many-requests':
      friendlyMessage = 'Too many login attempts. Please wait a moment and try again.';
      break;

    default:
      console.error('Firebase login error:', error); // For debugging
      friendlyMessage = 'Something went wrong. Please try again.';
  }

  setFirebaseError(friendlyMessage);
}

  setIsSubmitting(false);
};


  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" mb={3} textAlign="center">
          🔐 Login to Your Store
        </Typography>

        {firebaseError && <Alert severity="error" sx={{ mb: 2 }}>{firebaseError}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                fullWidth
                required
                InputProps={{ startAdornment: <Email sx={{ mr: 1 }} /> }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                fullWidth
                required
                InputProps={{ startAdornment: <Lock sx={{ mr: 1 }} /> }}
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 4 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <CircularProgress size={20} sx={{ color: 'white', mr: 1 }} />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={successAlert}
        autoHideDuration={3000}
        onClose={() => setSuccessAlert(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSuccessAlert(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          🎉 Login successful! Redirecting...
        </Alert>
      </Snackbar>
    </Container>
  );
}

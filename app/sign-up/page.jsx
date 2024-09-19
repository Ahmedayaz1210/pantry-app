/**
 * SignUp Component
 * 
 * This component provides the user registration functionality for the InventoryPal application.
 * It allows users to create a new account using their email and password.
 * 
 * Key features:
 * - User registration with email and password
 * - Firebase Authentication integration
 * - Firestore database integration for storing user data
 * - Error handling and display
 * - Navigation between sign-up and sign-in pages
 * - Styled Material-UI components for consistent design
 */

"use client";

import { useState } from "react";
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth, firestore } from '@/firebase';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  styled,
  alpha,
} from "@mui/material";
import { Login as LoginIcon } from "@mui/icons-material";
import { Oswald, Open_Sans } from "next/font/google";
import { useRouter } from "next/navigation";
import { collection, addDoc } from 'firebase/firestore';

// Font configurations
const Oswald_font = Oswald({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: "700",
});

// Styled components for consistent UI
const SignInPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(8),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

const SignInButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  backgroundColor: "#01796F",
  color: "#ffffff",
  "&:hover": {
    backgroundColor: alpha("#01796F", 0.8),
  },
}));

const OrText = styled(Typography)(({ theme }) => ({
  marginTop: '15px',
  marginBottom: '-10px',
  color: "#01796F",
}));

/**
 * SignUp Component
 * 
 * Renders the sign-up form and handles the registration process.
 */
const SignUp = () => {
  // State management for form inputs and error handling
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  // Firebase authentication hook
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
  
  const router = useRouter();

  /**
   * Handles the sign-up process when the form is submitted.
   * 
   * @param {Event} event - The form submission event
   */
  const handleSignUp = async (event) => {
    event.preventDefault();
    setError(""); // Clear any previous errors

    try {
      // Attempt to create a new user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(email, password);
      
      const uid = userCredential.user.uid;

      // Store additional user data in Firestore
      const usersRef = collection(firestore, 'users');
      await addDoc(usersRef, {
        uid: uid,
        email: email,
        password: password, // Note: Storing passwords in plaintext is not recommended for production
      });

      console.log("Signed up successfully");
      sessionStorage.setItem("user", true);
      setEmail("");
      setPassword("");
      router.push("/");
    } catch (error) {
      console.error("Sign up error:", error);
      setError("An error occurred while signing up");
    }
  };

  return (
    <Box sx={{ backgroundColor: "#eeeeee", minHeight: "100vh" }}>
      {/* Application bar */}
      <AppBar position="static" sx={{ backgroundColor: "#01796F" }}>
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, textAlign: "center" }}
          >
            InventoryPal
          </Typography>
        </Toolbar>
      </AppBar>
      
      {/* Sign-up form container */}
      <Container maxWidth="xs">
        <SignInPaper elevation={3}>
          <LoginIcon sx={{ fontSize: 40, color: "#01796F" }} />
          <Typography component="h1" variant="h5" className={Oswald_font.className}>
            Sign Up
          </Typography>
          <Box component="form" sx={{ mt: 1 }} onSubmit={handleSignUp}>
            {/* Email input field */}
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {/* Password input field */}
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* Error message display */}
            {error && <Typography color="error">{error}</Typography>}
            {/* Sign-up button */}
            <SignInButton
              type="submit"
              fullWidth
              variant="contained"
              className={openSans.className}
            >
              Sign Up
            </SignInButton>
            <OrText variant="body2" align="center">OR</OrText>
            {/* Navigation to sign-in page */}
            <SignInButton
              type="button"
              fullWidth
              variant="contained"
              className={openSans.className}
              onClick={() => router.push("/sign-in")}
            >
              Sign In
            </SignInButton>
          </Box>
        </SignInPaper>
      </Container>
    </Box>
  );
};

export default SignUp;

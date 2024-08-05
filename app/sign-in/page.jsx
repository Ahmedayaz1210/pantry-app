"use client";

import { useState } from "react";
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
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
import { collection, query, where, getDocs } from 'firebase/firestore';

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

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);

  const handleSignIn = async (event) => {
    event.preventDefault(); // Prevent form from submitting and refreshing the page
    setError(""); // Clear any previous errors

    try {
      const usersRef = collection(firestore, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();

        // Check the stored password
        if (userData.password === password) {
          console.log("Password matches.");
          await signInWithEmailAndPassword(email, password);
          console.log("Signed in successfully");
          sessionStorage.setItem('user', true);
          setEmail("");
          setPassword("");
          router.push("/");
        } else {
          setError("Incorrect password. Please try again.");
        }
      } else {
        setError("No account found with this email.");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setError("An error occurred during sign in. Please try again.");
    }
  };

  return (
    <Box sx={{ backgroundColor: "#eeeeee", minHeight: "100vh" }}>
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
      <Container maxWidth="xs">
        <SignInPaper elevation={3}>
          <LoginIcon sx={{ fontSize: 40, color: "#01796F" }} />
          <Typography component="h1" variant="h5" className={Oswald_font.className}>
            Sign In
          </Typography>
          <Box component="form" sx={{ mt: 1 }} onSubmit={handleSignIn}>
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
            {error && <Typography color="error">{error}</Typography>}
            <SignInButton
              type="submit"
              fullWidth
              variant="contained"
              className={openSans.className}
            >
              Sign In
            </SignInButton>
            <OrText variant="body2" align="center">OR</OrText>
            <SignInButton
              type="button"
              fullWidth
              variant="contained"
              className={openSans.className}
              onClick={() => router.push("/sign-up")}
            >
              Sign Up
            </SignInButton>
          </Box>
        </SignInPaper>
      </Container>
    </Box>
  );
};

export default SignIn;

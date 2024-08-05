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

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSignUp = async (event) => {
    event.preventDefault();
    setError(""); // Clear any previous errors

    try {
      const userCredential = await createUserWithEmailAndPassword(email, password);
      
      const uid = userCredential.user.uid;

      const usersRef = collection(firestore, 'users');
      await addDoc(usersRef, {
        uid: uid,
        email: email,
        password: password,
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
            Sign Up
          </Typography>
          <Box component="form" sx={{ mt: 1 }} onSubmit={handleSignUp}>
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
              Sign Up
            </SignInButton>
            <OrText variant="body2" align="center">OR</OrText>
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

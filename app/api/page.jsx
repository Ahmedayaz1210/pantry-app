"use client";

import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AppBar, Toolbar, IconButton, Typography, TextField, Box, Button, Paper } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export default function Chatbot() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro"});
      const result = await model.generateContent(input);
      const response = await result.response;
      const text = response.text();
      setResponse(text);
    } catch (error) {
      console.error('Error:', error);
      setResponse('An error occurred while processing your request.');
    }
  };

  return (
    <Box sx={{ backgroundColor: '#eeeeee', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ backgroundColor: '#01796F' }}>
        <Toolbar>
          <IconButton
            size="small"
            edge="start"
            color="inherit"
            aria-label="logout"
            sx={{ mr: 2 }}
            onClick={() => {
              signOut(auth);
              sessionStorage.removeItem('user');
              router.push('/sign-in');
            }}
          >
            <LogoutIcon /> Logout
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}
          >
            InventoryPal
          </Typography>
          <Button size="small"
                edge="start"
                color="inherit"
                aria-label="open drawer"
              onClick={() => {
                  router.push('/');
                }}>Inventory</Button>
        </Toolbar>
      </AppBar>
      
      <Box sx={{ maxWidth: 600, margin: 'auto', mt: 4, p: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
          Welcome to InventoryBot!
        </Typography>
        <Paper elevation={3} sx={{ p: 3, backgroundColor: 'white' }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              variant="outlined"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about your inventory..."
              margin="normal"
            />
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              sx={{ mt: 2, backgroundColor: '#01796F', '&:hover': { backgroundColor: '#015a54' } }}
              fullWidth
            >
              Send
            </Button>
          </form>
          {response && (
            <Typography variant="body1" sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <strong>Response:</strong> {response}
            </Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
/**
 * InventoryBot Component
 * 
 * This component serves as the chatbot interface for the InventoryPal application.
 * It utilizes Google's Generative AI to provide intelligent responses to user queries
 * about their inventory.
 * 
 * Key features:
 * - Integration with Google Generative AI (Gemini model)
 * - User authentication and session management
 * - Real-time chat interface
 * - Navigation between inventory dashboard and chatbot
 */

"use client";

import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AppBar, Toolbar, IconButton, Typography, TextField, Box, Button, Paper } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase';

// Initialize Google Generative AI with API key
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

/**
 * Chatbot Component
 * 
 * Renders the main chatbot interface and handles user interactions.
 */
export default function Chatbot() {
  // State for user input and AI response
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const router = useRouter();

  /**
   * Handles the submission of user queries to the AI model.
   * 
   * @param {Event} e - The form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Initialize the Gemini Pro model
      const model = genAI.getGenerativeModel({ model: "gemini-pro"});
      // Generate content based on user input
      const result = await model.generateContent(input);
      const response = await result.response;
      const text = response.text();
      // Update state with AI response
      setResponse(text);
    } catch (error) {
      console.error('Error:', error);
      setResponse('An error occurred while processing your request.');
    }
  };

  return (
    <Box sx={{ backgroundColor: '#eeeeee', minHeight: '100vh' }}>
      {/* Application bar with navigation and logout functionality */}
      <AppBar position="static" sx={{ backgroundColor: '#01796F' }}>
        <Toolbar>
          {/* Logout button */}
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
          {/* Application title */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}
          >
            InventoryPal
          </Typography>
          {/* Navigation button to inventory dashboard */}
          <Button 
            size="small"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={() => {
              router.push('/');
            }}
          >
            Inventory
          </Button>
        </Toolbar>
      </AppBar>
      
      {/* Main content area */}
      <Box sx={{ maxWidth: 600, margin: 'auto', mt: 4, p: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
          Welcome to InventoryBot!
        </Typography>
        {/* Chat interface */}
        <Paper elevation={3} sx={{ p: 3, backgroundColor: 'white' }}>
          <form onSubmit={handleSubmit}>
            {/* User input field */}
            <TextField
              fullWidth
              variant="outlined"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about your inventory..."
              margin="normal"
            />
            {/* Submit button */}
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
          {/* AI response display */}
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

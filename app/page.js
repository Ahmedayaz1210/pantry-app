/**
 * Dashboard Component for Inventory Pal
 * 
 * This component serves as the main interface for the Inventory Pal application.
 * It provides functionality for viewing, adding, updating, and deleting inventory items.
 * The component also handles user authentication and navigation.
 * 
 * Key features:
 * - Display current inventory items
 * - Add new items with name, quantity, and expiration date
 * - Update item quantities
 * - Delete items
 * - User authentication check
 * - Navigation to AI chatbot
 */

"use client";
import * as React from 'react';
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { 
  AppBar, Box, Toolbar, IconButton, Typography, Button, 
  ButtonGroup, Stack, Fab, Modal, TextField, Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { Open_Sans, Oswald } from 'next/font/google';
import { query, collection, getDocs, getDoc, setDoc, doc, deleteDoc } from 'firebase/firestore';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Unstable_NumberInput as BaseNumberInput,
  numberInputClasses,
} from '@mui/base/Unstable_NumberInput';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase';
import { useRouter } from 'next/navigation';
import LogoutIcon from '@mui/icons-material/Logout';
import { signOut } from 'firebase/auth';

// Custom NumberInput component with validation
const NumberInput = React.forwardRef(function NumberInput(props, ref) {
  const handleChange = (event, val) => {
    if (val > 0) {
      props.onChange(event, val);
    }
  };
  return (
    <BaseNumberInput
      slots={{
        root: StyledInputRoot,
        input: StyledInputElement,
        incrementButton: StyledButton,
        decrementButton: StyledButton,
      }}
      slotProps={{
        incrementButton: {
          children: '▴',
        },
        decrementButton: {
          children: '▾',
        },
      }}
      {...props}
      onChange={handleChange}
      ref={ref}
    />
  );
});

// Color definitions for styling
const blue = {
  100: '#DAECFF',
  200: '#80BFFF',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

// Styled components for custom NumberInput
const StyledInputRoot = styled('div')(/* ... */);
const StyledInputElement = styled('input')(/* ... */);
const StyledButton = styled('button')(/* ... */);

// Font definitions
const Oswald_font = Oswald({
  subsets: ['latin'],
  display: 'swap',
  weight: '400'
})

const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  weight: '700'
})

// Styled component for inventory item display
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#ffff',
  padding: theme.spacing(5),
  margin: theme.spacing(1),
  width: '100%',
}));

/**
 * Home Component
 * 
 * This is the main component for the dashboard page.
 * It handles user authentication, inventory management, and UI rendering.
 */
export default function Home() {
  // State and hooks
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [userSession, setUserSession] = useState(null);
  const [inventory, setInventory] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [itemName, setItemName] = React.useState('');
  const [quantity, setQuantity] = React.useState(1);
  const [expiration, setExpiration] = React.useState(null);

  // Check for user authentication
  useEffect(() => {
    const session = sessionStorage.getItem('user');
    setUserSession(session);

    if (!user && !session) {
      router.push('/sign-in');
    }
  }, [user, router]);

  // Fetch inventory on component mount
  useEffect(() => {
    updateInventory();
  }, []);

  /**
   * Converts a dayjs date object to a JavaScript Date object
   * @param {Object} dayjsDate - The dayjs date object
   * @returns {Date|null} - JavaScript Date object or null
   */
  const convertToDate = (dayjsDate) => {
    return dayjsDate ? dayjsDate.toDate() : null;
  };

  /**
   * Fetches the current inventory from Firebase
   */
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  /**
   * Adds a new item to the inventory
   * @param {string} name - Item name
   * @param {number} quantity - Item quantity
   * @param {Object} expiration - Expiration date
   */
  const addItem = async (name, quantity, expiration) => { 
    const docRef = doc(collection(firestore, 'inventory'), name);
    await setDoc(docRef, {
      quantity: quantity,
      expiration: convertToDate(expiration),
    });
    await updateInventory();
  }

  /**
   * Increases the quantity of an item by 1
   * @param {string} item - Item name
   */
  const plusItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity, expiration } = docSnap.data();
      await setDoc(docRef, {
        quantity: quantity + 1,
        expiration,
      });
    }
    await updateInventory();
  };

  /**
   * Decreases the quantity of an item by 1
   * @param {string} item - Item name
   */
  const subtractItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity, expiration } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, {
          quantity: quantity - 1,
          expiration,
        });
      }
    }
    await updateInventory();
  };

  /**
   * Deletes an item from the inventory
   * @param {string} item - Item name
   */
  const deleteItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await deleteDoc(docRef);
    }
    await updateInventory();
  };

  // Modal control functions
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Render the component
  return (
    <>
      <Box sx={{ backgroundColor: '#eeeeee', minHeight: '100vh' }}>
        {/* AppBar with logout and navigation buttons */}
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" sx={{ backgroundColor: '#01796F' }}>
            <Toolbar>
              {/* Logout button */}
              <IconButton
                size="small"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                sx={{ mr: 2 }}
                onClick={() => {
                  signOut(auth);
                  sessionStorage.removeItem('user');
                  router.push('/sign-in');
                }}
              >
                <LogoutIcon  /> Logout
              </IconButton>

              {/* App title */}
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', marginLeft: '-100px' }}
              >
                InventoryPal
              </Typography>

              {/* InventoryBot navigation button */}
              <Button 
                size="small"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={() => {
                  router.push('/api');
                }}
              >
                InventoryBot
              </Button>
            </Toolbar>
          </AppBar>
        </Box>

        <Box>
          {/* Modal for adding new items */}
          <Modal open={open} onClose={handleClose}>
            {/* Modal content */}
            {/* ... (Modal content remains the same) ... */}
          </Modal>

          {/* Welcome message */}
          <Typography
            variant="h5"
            component="div"
            className={Oswald_font.className}
            sx={{
              flexGrow: 1,
              display: 'flex',
              justifyContent: 'center',
              margin: '20px 0px 10px',
            }}
          >
            Welcome to InventoryPal!
          </Typography>

          {/* Inventory list */}
          <Stack
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 2,
            }}
          >
            {inventory.map(({ name, quantity, expiration }) => (
              <Item
                key={name}
                sx={{ position: 'relative', display: 'flex' }}
                className={openSans.className}
              >
                {/* Item name */}
                {name[0].toUpperCase() + name.slice(1)}
                <Box
                  style={{
                    position: 'absolute',
                    right: '0',
                    marginRight: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}
                >
                  {/* Expiration date */}
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      marginRight: '20px',
                      fontSize: '14px',
                      fontStyle: 'italic',
                    }}
                  >
                    Expiration: {expiration ? new Date(expiration.seconds * 1000).toLocaleDateString() : 'No Expiration'}
                  </Typography>

                  {/* Quantity control buttons */}
                  <ButtonGroup variant="contained" aria-label="add">
                    <Button
                      sx={{ backgroundColor: '#ff7777', color: 'black' }}
                      onClick={() => {
                        subtractItem(name);
                      }}
                    >
                      -
                    </Button>
                    <Button
                      sx={{
                        color: 'black',
                        backgroundColor: '#ADD8E6',
                        '&:hover': {
                          backgroundColor: '#ADD8E6',
                          cursor: 'default',
                        },
                      }}
                    >
                      {quantity}
                    </Button>
                    <Button
                      sx={{ backgroundColor: '#98fb98', color: 'black' }}
                      onClick={() => {
                        plusItem(name);
                      }}
                    >
                      +
                    </Button>
                  </ButtonGroup>

                  {/* Delete button */}
                  <Button
                    variant="contained"
                    style={{
                      float: 'inline-end',
                      backgroundColor: 'red',
                      marginLeft: '10px',
                      marginRight: '10px',
                      width: '20px',
                      maxHeight: '90px',
                    }}
                    onClick={() => {
                      deleteItem(name);
                    }}
                  >
                    <DeleteIcon />
                  </Button>
                </Box>
              </Item>
            ))}
          </Stack>

          {/* Add item button */}
          <Fab
            color="primary"
            aria-label="add"
            sx={{
              float: 'right',
              margin: '5px 15px 15px',
              position: 'fixed',
              right: '15px',
              bottom: '15px',
              backgroundColor: '#ADD8E6',
            }}
            onClick={() => {
              handleOpen();
            }}
          >
            <AddIcon />
          </Fab>
        </Box>
      </Box>
    </>
  );
}

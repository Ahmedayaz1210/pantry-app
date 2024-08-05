"use client";
import * as React from 'react';
import { firestore } from '@/firebase';
import { AppBar, Box, Toolbar, IconButton, Typography, DemoContainer, DemoItem, Paper, Button, ButtonGroup, Stack, Fab, Modal, styled, alpha, TextField } from '@mui/material';
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


const NumberInput = React.forwardRef(function CustomNumberInput(props, ref) {
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

const StyledInputRoot = styled('div')(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 400;
  border-radius: 8px;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
  display: grid;
  grid-template-columns: 1fr 19px;
  grid-template-rows: 1fr 1fr;
  overflow: hidden;
  column-gap: 8px;
  padding: 4px;

  &.${numberInputClasses.focused} {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
  }

  &:hover {
    border-color: ${blue[400]};
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`,
);

const StyledInputElement = styled('input')(
  ({ theme }) => `
  font-size: 0.875rem;
  font-family: inherit;
  font-weight: 400;
  line-height: 1.5;
  grid-column: 1/2;
  grid-row: 1/3;
  background: inherit;
  border: none;
  border-radius: inherit;
  padding: 8px 12px;
  outline: 0;
`,
);

const StyledButton = styled('button')(
  ({ theme }) => `
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  appearance: none;
  padding: 0;
  width: 19px;
  height: 19px;
  font-family: system-ui, sans-serif;
  font-size: 0.875rem;
  line-height: 1;
  box-sizing: border-box;
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 0;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 120ms;

  &:hover {
    background: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
    border-color: ${theme.palette.mode === 'dark' ? grey[600] : grey[300]};
    cursor: pointer;
  }

  &.${numberInputClasses.incrementButton} {
    grid-column: 2/3;
    grid-row: 1/2;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    border: 1px solid;
    border-bottom: 0;
    &:hover {
      cursor: pointer;
      background: ${blue[400]};
      color: ${grey[50]};
    }

  border-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
  color: ${theme.palette.mode === 'dark' ? grey[200] : grey[900]};
  }

  &.${numberInputClasses.decrementButton} {
    grid-column: 2/3;
    grid-row: 2/3;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    border: 1px solid;
    &:hover {
      cursor: pointer;
      background: ${blue[400]};
      color: ${grey[50]};
    }

  border-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
  color: ${theme.palette.mode === 'dark' ? grey[200] : grey[900]};
  }
  & .arrow {
    transform: translateY(-1px);
  }
`,
);



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





const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#ffff',
  padding: theme.spacing(5),
  margin: theme.spacing(1),
  width: '100%',
}));

export default function Home() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const userSession = sessionStorage.getItem('user');
  const [inventory, setInventory] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [itemName, setItemName] = React.useState('');
  const [quantity, setQuantity] = React.useState(1);
  const [expiration, setExpiration] = React.useState(null);

  if (!user && !userSession) {
    router.push('/sign-in');
  }

  const convertToDate = (dayjsDate) => {
    // If dayjsDate is not null, return a Date object
    console.log("here");
    console.log(dayjsDate);
    return dayjsDate ? dayjsDate.toDate() : null;
  };
  // Fetching inventory from Firebase
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

  const addItem = async (name, quantity, expiration) => { 
    const docRef = doc(collection(firestore, 'inventory'), name);
    await setDoc(docRef, {
      quantity: quantity,
      expiration: convertToDate(expiration),
    });
    await updateInventory();
  }

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

  const deleteItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await deleteDoc(docRef);
    }
    await updateInventory();
  };

  React.useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Box sx={{ backgroundColor: '#eeeeee', minHeight: '100vh' }}>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" sx={{ backgroundColor: '#01796F' }}>
            <Toolbar>
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

              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', marginLeft: '-100px' }}
              >
                InventoryPal
              </Typography>
              <Button size="small"
                edge="start"
                color="inherit"
                aria-label="open drawer"
              onClick={() => {
                  router.push('/api');
                }}>InventoryBot</Button>
            </Toolbar>
          </AppBar>
        </Box>
        <Box>
          <Modal open={open} onClose={handleClose}>
            <Box
              position="absolute"
              top="50%"
              left="50%"
              width={400}
              bgcolor="white"
              border="2px solid #000"
              boxShadow={24}
              p={4}
              display="flex"
              alignItems="center"
              flexDirection="column"
              gap={2}
              sx={{ transform: 'translate(-50%, -50%)', backgroundColor: '#eeeeee' }}
            >
              <Typography variant="h6" display="flex" justifyContent="center">
                Add Item
              </Typography>
              <Stack
                direction="row"
                display="flex"
                justifyContent="center"
                sx={{ marginTop: '-10px', marginBottom: '10px' }}
                spacing={2}
                width="100%"
              >
                <TextField
                  variant="outlined"
                  fullWidth
                  value={itemName}
                  onChange={(e) => {
                    setItemName(e.target.value);
                  }}
                ></TextField>
              </Stack>
              <Typography variant="h6" display="flex" justifyContent="center">
                Add Quantity
              </Typography>
              <Stack
                direction="row"
                display="flex"
                justifyContent="center"
                sx={{ marginTop: '-10px', marginBottom: '10px' }}
                spacing={2}
                width="100%"
              >
                <NumberInput
                  aria-label="Demo number input"
                  placeholder="Type a number…"
                  value={quantity}
                  onChange={(event, val) => setQuantity(val)}
                />
              </Stack>
              <Typography variant="h6" display="flex" justifyContent="center">
                Add Expiration date
              </Typography>
              <Stack
                direction="row"
                display="flex"
                justifyContent="center"
                sx={{ marginTop: '-10px', marginBottom: '20px' }}
                spacing={2}
                width="100%"
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker']}>
                    <DemoItem>
                      <DatePicker
                        value={expiration}
                        onChange={(newValue) => {
                          setExpiration(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              </Stack>
              <Button
                sx={{ width: '20%' }}
                variant="contained"
                onClick={() => {
                  addItem(itemName, quantity, expiration);
                  setItemName('');
                  setQuantity(1);
                  setExpiration(null);
                  handleClose();
                }}
              >
                Add
              </Button>
            </Box>
          </Modal>
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

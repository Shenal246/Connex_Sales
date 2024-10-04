// src/compo/Sidebar.js

import React, { useState, useEffect } from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Divider, Typography } from '@mui/material';
import {
  Home, // Updated icon for Home
  Campaign, // Updated icon for Promotion
  Event, // Updated icon for Video & Events
  Group, // Updated icon for Partner MGT
  Store, // Updated icon for Product MGT
  AccountCircle,
  Logout,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import LogoImage from './img/logo-no-background.png';
import CopyrightLogo from './img/image.png'; // Import your company logo
import axios from 'axios';
import APIConnection from '../config';

// Define theme colors with a modern look
const themeColors = {
  sidebarBg: 'linear-gradient(to bottom, #2e2e2e, #444444)', // Updated gradient for a modern look
  buttonBg: '#444444', // Consistent button background
  buttonText: '#ffffff', // Text color for contrast
  hoverBg: '#555555', // Hover effect color
  borderColor: '#222222', // Border color for dividing sections
  logoBg: '#2e2e2e', // Background for logo area
  footerBg: '#333333', // Footer background
};

// Define styled components
const SidebarContainer = styled(Box)(({ theme }) => ({
  width: '200px', // Fixed width
  height: '100vh', // Full height
  background: themeColors.sidebarBg, // Sidebar background gradient
  color: themeColors.buttonText, // Text color
  display: 'flex', // Flex container
  flexDirection: 'column', // Column layout
  boxShadow: theme.shadows[3], // Box shadow for depth
  borderRight: `1px solid ${themeColors.borderColor}`, // Right border
  overflowY: 'auto', // Scrollable content
  position: 'fixed', // Fixed position
  top: 0, // Align to top
  left: 0, // Align to left
  margin: 0, // No margin
  padding: 0, // No padding
  zIndex: 1200, // High z-index
  transition: 'transform 0.3s ease-in-out', // Transition effect
  [theme.breakpoints.down('sm')]: {
    transform: 'translateX(-100%)', // Off-screen on mobile
    '&.active': {
      transform: 'translateX(0)', // Slide in when active
    },
  },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2), // Spacing for content
  display: 'flex', // Flexbox
  alignItems: 'center', // Center items
  justifyContent: 'center', // Center content
  backgroundColor: themeColors.logoBg, // Background color
  borderBottom: `1px solid ${themeColors.borderColor}`, // Bottom border
  margin: 0, // No margin
}));

const LogoImageStyled = styled('img')({
  height: '35px', // Adjusted logo height
  width: 'auto', // Maintain aspect ratio
  transition: 'transform 0.2s', // Smooth transition
  '&:hover': {
    transform: 'scale(1.1)', // Scale effect on hover
  },
});

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: '4px', // Rounded corners
  width: '90%', // Full width with margin
  margin: '5px auto', // Center with margin
  padding: '5px 12px', // Padding for button
  height: '35px', // Fixed height for buttons
  alignItems: 'center', // Center alignment
  backgroundColor: themeColors.buttonBg, // Background color
  color: themeColors.buttonText, // Text color
  '&:hover': {
    backgroundColor: themeColors.hoverBg, // Hover background
    transform: 'scale(1.03)', // Slight scale on hover
    boxShadow: theme.shadows[2], // Shadow on hover
  },
  '& .MuiListItemIcon-root': {
    minWidth: '35px', // Icon container width
    color: themeColors.buttonText, // Icon color
    marginRight: '8px', // Spacing between icon and text
  },
  '& .MuiListItemText-primary': {
    color: themeColors.buttonText, // Text color
    fontSize: '14px', // Font size for readability
    fontWeight: 400, // Normal font weight
    fontFamily: "'Roboto', sans-serif", // Font family
  },
}));

const CopyrightContainer = styled(Box)(({ theme }) => ({
  marginTop: 'auto', // Push to bottom
  padding: theme.spacing(2), // Padding for content
  textAlign: 'center', // Center alignment
  backgroundColor: themeColors.footerBg, // Background color
  borderTop: `1px solid ${themeColors.borderColor}`, // Top border
  color: themeColors.buttonText, // Text color
  display: 'flex', // Flexbox
  justifyContent: 'center', // Center content
  alignItems: 'center', // Center items
}));

const CopyrightLogoStyled = styled('img')({
  height: '60px', // Adjusted logo height
  width: 'auto', // Maintain aspect ratio
  opacity: '0.75', // Transparency effect
  borderRadius: '10px', // Rounded corners
  transition: 'opacity 0.3s', // Transition effect
  '&:hover': {
    opacity: '1', // Full opacity on hover
  },
});

// Sidebar component
const Sidebar = () => {

  const [privileges, setPrivileges] = useState([]);
  const getPrivilegesApi = APIConnection.getPrivileges;

  useEffect(() => {
    const getPrivilegesFunction = async () => {
      try {
        const response = await axios.get(getPrivilegesApi, { withCredentials: true });
        setPrivileges(response.data.Privileges);
      } catch (error) {
        console.error('Error fetching privileges:', error);
      }
    };

    getPrivilegesFunction();
  }, []);

const hasPrivilege = (privilege) => privileges.includes(privilege);

  const navItems = [
    { text: 'Home', icon: <Home />, path: '/dashboard' , privilege: 'Sales - Dashboard'},
    { text: 'Promotion REQ', icon: <Campaign />, path: '/promo' , privilege: 'Sales - Promotion Request'},
    { text: 'Product REQ', icon: <Store />, path: '/product' , privilege: 'Sales - Product Request'},
    { text: 'Deal REQ', icon: <Group />, path: '/vnmgt' , privilege: 'Sales - Deal Request'},
  
  ];

  return (
    <SidebarContainer>
      <LogoContainer>
        <LogoImageStyled src={LogoImage} alt="Logo" />
      </LogoContainer>
      <Divider sx={{ bgcolor: themeColors.borderColor }} />
      <Typography
        variant="subtitle1"
        sx={{
          textAlign: 'center',
          fontWeight: 500,
          color: themeColors.buttonText,
          py: 1,
          fontSize: '13px',
          fontFamily: "'Roboto', sans-serif",
        }}
      >
        Sales Service
      </Typography>
      <Divider sx={{ bgcolor: themeColors.borderColor }} />
      <List>
        {navItems.filter(item => hasPrivilege(item.privilege)).map((item, index) => (
          <StyledListItem
            button
            component={Link}
            to={item.path}
            key={index}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </StyledListItem>
        ))}
      </List>
      <Divider sx={{ bgcolor: themeColors.borderColor }} />
      <CopyrightContainer>
        <CopyrightLogoStyled src={CopyrightLogo} alt="Company Logo" />
      </CopyrightContainer>
    </SidebarContainer>
  );
};

export default Sidebar;

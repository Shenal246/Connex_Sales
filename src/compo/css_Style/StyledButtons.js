// src/StyledButtons.js
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';

// Define theme colors
const themeColors = {
  buttonPrimary: '#007bff', // Light blue for primary buttons
  buttonPrimaryHover: '#0056b3', // Darker blue for button hover
  buttonSecondary: '#6c757d', // Gray for secondary buttons
  buttonSecondaryHover: '#5a6268', // Darker gray for secondary button hover
};

const ButtonBase = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  padding: '8px 16px',
  textTransform: 'none',
  fontWeight: 'bold',
  fontSize: '14px',
  height: '35px', // Adjust height
  minWidth: '120px', // Ensure minimum width
  '&:hover': {
    transition: 'background-color 0.3s ease',
  },
}));

export const PrimaryButton = styled(ButtonBase)(({ theme }) => ({
  backgroundColor: themeColors.buttonPrimary,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: themeColors.buttonPrimaryHover,
  },
}));

export const SecondaryButton = styled(ButtonBase)(({ theme }) => ({
  backgroundColor: themeColors.buttonSecondary,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: themeColors.buttonSecondaryHover,
  },
}));

export default { PrimaryButton, SecondaryButton };

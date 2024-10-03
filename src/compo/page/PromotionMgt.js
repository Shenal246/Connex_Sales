// src/compo/page/PromotionMgt.js

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  Zoom,
} from '@mui/material';
import { styled } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';

const themeColor = {
  primary: '#444',
  primaryDark: '#666',
  success: '#4caf50',
  error: '#f44336',
  headerBg: '#444',
  headerTextColor: '#ffffff',
  borderColor: '#777',
  color: '#000000',
  rowHoverColor: '#ebebeb',
  rowAlternateColor: '#f5f5f5',
  rowHoverHighlight: '#e0f7fa',
  activeStatusColor: '#4caf50',
  inactiveStatusColor: '#f44336',
};

const PremiumButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: '6px',
  padding: '6px 12px',
  textTransform: 'none',
  fontWeight: 'bold',
  height: '30px',
  minWidth: '80px',
  fontSize: '12px',
  transition: 'background-color 0.3s ease, transform 0.3s ease',
  cursor: 'pointer',
  border: 'none',
  boxShadow: `0 3px 6px rgba(0, 0, 0, 0.1)`,
  background: variant === 'contained' ? themeColor.primary : 'transparent',
  color: variant === 'contained' ? theme.palette.common.white : themeColor.primary,
  border: variant === 'outlined' ? `1px solid ${themeColor.primary}` : 'none',
  '&:hover': {
    backgroundColor: variant === 'contained' ? themeColor.primaryDark : 'rgba(51, 51, 51, 0.05)',
    transform: 'scale(1.03)',
  },
  '&:active': {
    transform: 'scale(0.97)',
  },
}));

const AddButton = styled(Button)(({ theme }) => ({
  borderRadius: '6px',
  padding: '8px 16px',
  textTransform: 'none',
  fontWeight: 'bold',
  fontSize: '14px',
  transition: 'background-color 0.3s ease, transform 0.3s ease',
  cursor: 'pointer',
  color: theme.palette.common.white,
  backgroundColor: themeColor.success,
  boxShadow: `0 3px 6px rgba(0, 0, 0, 0.2)`,
  '&:hover': {
    backgroundColor: themeColor.primaryDark,
    transform: 'scale(1.05)',
  },
  '&:active': {
    transform: 'scale(0.95)',
  },
  position: 'absolute',
  right: theme.spacing(2),
  top: theme.spacing(2),
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: '16px',
  borderBottom: `1px solid ${themeColor.borderColor}`,
  padding: '6px 8px',
  textAlign: 'left',
  backgroundColor: themeColor.rowAlternateColor,
  color: themeColor.color,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  cursor: 'pointer',
  height: '40px',
  transition: 'background-color 0.3s ease',
  '&:nth-of-type(odd)': {
    backgroundColor: '#ffffff',
  },
  '&:hover': {
    backgroundColor: themeColor.rowHoverHighlight,
    boxShadow: `0px 2px 4px rgba(0,0,0,0.05)`,
  },
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: themeColor.primary,
  color: themeColor.headerTextColor,
  position: 'sticky',
  top: 0,
  zIndex: 2,
  '& th': {
    fontSize: '13px',
    fontWeight: 'bold',
    padding: '10px 12px',
    textAlign: 'left',
    borderRight: `1px solid ${themeColor.borderColor}`,
    background: themeColor.primary,
    color: themeColor.headerTextColor,
    '&:last-child': {
      borderRight: 'none',
    },
  },
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: themeColor.headerTextColor,
  fontSize: '18px',
  marginBottom: theme.spacing(2),
  textAlign: 'center',
  background: themeColor.headerBg,
  width: '50%',
  padding: '6px 0',
  marginLeft: 'auto',
  marginRight: 'auto',
  borderRadius: '6px',
  boxShadow: '0px 3px 6px rgba(0,0,0,0.1)',
  position: 'sticky',
  top: 0,
  zIndex: 3,
}));

const DetailTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: themeColor.color,
  fontSize: '16px',
  marginBottom: theme.spacing(1.5),
  textAlign: 'center',
}));

const DetailTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: `1px solid ${themeColor.borderColor}`,
  padding: '8px',
  fontSize: '12px',
  color: themeColor.color,
  '&:first-of-type': {
    fontWeight: 'bold',
    color: themeColor.primaryDark,
  },
}));

const BlinkingDot = styled('span')({
  display: 'inline-block',
  height: '8px',
  width: '8px',
  borderRadius: '50%',
  marginRight: '5px',
  animation: 'blink-animation 0.5s infinite',
  '@keyframes blink-animation': {
    '0%': { opacity: 1 },
    '50%': { opacity: 0 },
    '100%': { opacity: 1 },
  },
});



const PromotionMgt = () => {
  const [promotionData, setPromotionData] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [showPromotionPopup, setShowPromotionPopup] = useState(false);
  const [showAddPromotionPopup, setShowAddPromotionPopup] = useState(false);
  const [newPromotion, setNewPromotion] = useState({
    altDescription: '',
    details: '',
    uploadedDate: '',
    status: 'inactive',
    imageUrl: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleRowClick = (promotion) => {
    setSelectedPromotion(promotion);
    setShowPromotionPopup(true);
  };

  const handleClosePromotionPopup = () => {
    setShowPromotionPopup(false);
    setSelectedPromotion(null);
  };

  const handleCloseAddPromotionPopup = () => {
    setShowAddPromotionPopup(false);
    setNewPromotion({
      altDescription: '',
      details: '',
      uploadedDate: '',
      status: 'inactive',
      imageUrl: '',
    });
  };

  const handleStatusChange = (e) => {
    setSelectedPromotion({ ...selectedPromotion, status: e.target.value });
  };

  const handleAddPromotionStatusChange = (e) => {
    setNewPromotion({ ...newPromotion, status: e.target.value });
  };

  const handleUpdate = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const updatedData = promotionData.map((promotion) =>
        promotion.id === selectedPromotion.id ? selectedPromotion : promotion
      );
      setPromotionData(updatedData);
      setIsProcessing(false);
      setShowPromotionPopup(false);
      Swal.fire({
        icon: 'success',
        title: 'Promotion Updated!',
        text: 'The promotion details have been successfully updated.',
        confirmButtonColor: themeColor.success,
        confirmButtonText: 'OK',
      });
    }, 1000);
  };

  const handleAddPromotion = () => {
    if (newPromotion.altDescription && newPromotion.details && newPromotion.uploadedDate && newPromotion.imageUrl) {
      const newPromotionData = {
        ...newPromotion,
        id: promotionData.length + 1,
      };
      setPromotionData([...promotionData, newPromotionData]);
      Swal.fire({
        icon: 'success',
        title: 'Promotion Added!',
        text: 'The new promotion has been successfully added.',
        confirmButtonColor: themeColor.success,
        confirmButtonText: 'OK',
      });
      handleCloseAddPromotionPopup();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Missing Information',
        text: 'Please fill in all required fields.',
        confirmButtonColor: themeColor.error,
        confirmButtonText: 'OK',
      });
    }
  };

  const filteredPromotionData = promotionData.filter((promotion) =>
    promotion.altDescription.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleImageUpload = (e, setImageUrl) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateAging = (uploadedDate) => {
    const currentDate = dayjs();
    const uploaded = dayjs(uploadedDate);
    return currentDate.diff(uploaded, 'day');
  };

  return (
    <Box sx={{ padding: 2, overflowY: 'hidden', position: 'relative' }}>
      <TitleTypography variant="h5">Promotion Management</TitleTypography>
      <AddButton
        startIcon={<AddCircleOutlineIcon />}
        onClick={() => setShowAddPromotionPopup(true)}
      >
        Add New Promotion
      </AddButton>
      <Box sx={{ marginBottom: 2, display: 'flex', justifyContent: 'center' }}>
        <TextField
          label="Search Promotions"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ width: '300px' }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <TableContainer
        component={Paper}
        sx={{
          overflow: 'auto',
          height: '430px',
          marginBottom: '20px',
          borderRadius: '8px',
          boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
        }}
      >
        <Table stickyHeader>
          <StyledTableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>ALT Description</StyledTableCell>
              <StyledTableCell>Details</StyledTableCell>
              <StyledTableCell>Uploaded Date</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Aging</StyledTableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {filteredPromotionData.map((promotion) => (
              <StyledTableRow
                key={promotion.id}
                onClick={() => handleRowClick(promotion)}
              >
                <StyledTableCell>{promotion.id}</StyledTableCell>
                <StyledTableCell>{promotion.altDescription}</StyledTableCell>
                <StyledTableCell>{promotion.details}</StyledTableCell>
                <StyledTableCell>{promotion.uploadedDate}</StyledTableCell>
                <StyledTableCell>
                  {promotion.status === 'active' ? (
                    <Typography
                      sx={{
                        color: themeColor.activeStatusColor,
                        fontWeight: 'bold',
                      }}
                    >
                      <BlinkingDot
                        style={{ backgroundColor: themeColor.activeStatusColor }}
                      />
                      Active
                    </Typography>
                  ) : (
                    <Typography sx={{ color: themeColor.inactiveStatusColor }}>
                      <BlinkingDot
                        style={{ backgroundColor: themeColor.inactiveStatusColor }}
                      />
                      Inactive
                    </Typography>
                  )}
                </StyledTableCell>
                <StyledTableCell>{calculateAging(promotion.uploadedDate)} days</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Promotion Detail Popup */}
      <Dialog
        open={showPromotionPopup}
        onClose={handleClosePromotionPopup}
        PaperProps={{
          style: {
            overflow: 'hidden',
            width: '500px',
            borderRadius: '8px',
            boxShadow: '0px 3px 6px rgba(0,0,0,0.2)',
          },
        }}
        TransitionComponent={Zoom}
        TransitionProps={{ timeout: 400 }}
      >
        <DialogContent>
          {selectedPromotion && (
            <>
              <TextField
                label="ALT Description"
                variant="outlined"
                fullWidth
                value={selectedPromotion.altDescription}
                onChange={(e) =>
                  setSelectedPromotion({
                    ...selectedPromotion,
                    altDescription: e.target.value,
                  })
                }
                sx={{ marginBottom: '12px' }}
              />
              <TextField
                label="Details"
                variant="outlined"
                fullWidth
                multiline
                value={selectedPromotion.details}
                onChange={(e) =>
                  setSelectedPromotion({
                    ...selectedPromotion,
                    details: e.target.value,
                  })
                }
                sx={{ marginBottom: '12px' }}
              />
              <TextField
                label="Image URL"
                variant="outlined"
                fullWidth
                value={selectedPromotion.imageUrl}
                onChange={(e) =>
                  setSelectedPromotion({
                    ...selectedPromotion,
                    imageUrl: e.target.value,
                  })
                }
                sx={{ marginBottom: '12px' }}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleImageUpload(e, (imageUrl) =>
                    setSelectedPromotion({ ...selectedPromotion, imageUrl })
                  )
                }
                style={{ marginBottom: '12px' }}
              />
              {selectedPromotion.imageUrl && (
                <img
                  src={selectedPromotion.imageUrl}
                  alt={selectedPromotion.altDescription}
                  style={{ width: '100%', borderRadius: '8px', marginBottom: '15px' }}
                />
              )}
              <Table>
                <TableBody>
                  <TableRow>
                    <DetailTableCell>Uploaded Date:</DetailTableCell>
                    <DetailTableCell>{selectedPromotion.uploadedDate}</DetailTableCell>
                  </TableRow>
                  <TableRow>
                    <DetailTableCell>Current Status:</DetailTableCell>
                    <DetailTableCell>
                      <Select
                        value={selectedPromotion.status}
                        onChange={handleStatusChange}
                        fullWidth
                      >
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                      </Select>
                    </DetailTableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <PremiumButton
            variant="outlined"
            color="error"
            onClick={handleClosePromotionPopup}
          >
            Cancel
          </PremiumButton>
          <PremiumButton
            variant="contained"
            onClick={handleUpdate}
            disabled={isProcessing}
          >
            {isProcessing ? <CircularProgress size={20} /> : 'Update'}
          </PremiumButton>
        </DialogActions>
      </Dialog>

      {/* Add New Promotion Popup */}
      <Dialog
        open={showAddPromotionPopup}
        onClose={handleCloseAddPromotionPopup}
        PaperProps={{
          style: {
            overflow: 'hidden',
            width: '500px',
            borderRadius: '8px',
            boxShadow: '0px 3px 6px rgba(0,0,0,0.2)',
          },
        }}
        TransitionComponent={Zoom}
        TransitionProps={{ timeout: 400 }}
      >
        <DialogContent>
          <TextField
            label="ALT Description"
            variant="outlined"
            fullWidth
            value={newPromotion.altDescription}
            onChange={(e) =>
              setNewPromotion({ ...newPromotion, altDescription: e.target.value })
            }
            sx={{ marginBottom: '12px' }}
          />
          <TextField
            label="Details"
            variant="outlined"
            fullWidth
            multiline
            value={newPromotion.details}
            onChange={(e) =>
              setNewPromotion({ ...newPromotion, details: e.target.value })
            }
            sx={{ marginBottom: '12px' }}
          />
          <TextField
            label="Uploaded Date"
            variant="outlined"
            fullWidth
            type="date"
            InputLabelProps={{ shrink: true }}
            value={newPromotion.uploadedDate}
            onChange={(e) =>
              setNewPromotion({ ...newPromotion, uploadedDate: e.target.value })
            }
            sx={{ marginBottom: '12px' }}
          />
          <Select
            label="Status"
            value={newPromotion.status}
            onChange={handleAddPromotionStatusChange}
            fullWidth
            sx={{ marginBottom: '12px' }}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleImageUpload(e, (imageUrl) =>
                setNewPromotion({ ...newPromotion, imageUrl })
              )
            }
            style={{ marginBottom: '12px' }}
          />
          {newPromotion.imageUrl && (
            <img
              src={newPromotion.imageUrl}
              alt={newPromotion.altDescription}
              style={{ width: '100%', borderRadius: '8px', marginBottom: '15px' }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <PremiumButton
            variant="outlined"
            color="error"
            onClick={handleCloseAddPromotionPopup}
          >
            Cancel
          </PremiumButton>
          <PremiumButton variant="contained" onClick={handleAddPromotion}>
            Add Promotion
          </PremiumButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PromotionMgt;

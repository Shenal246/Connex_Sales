// src/compo/page/VendorMgtPage.js
import bcrypt from 'bcryptjs';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
  CircularProgress,
  IconButton,
  MenuItem,
  Select,
  Zoom,
  Slide,
} from '@mui/material';
import { styled } from '@mui/system';
import PasswordIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Swal from 'sweetalert2';

import axios from 'axios';
import { apilinkmain } from '../../API';

const themeColor = {
  primary: '#444',
  primaryDark: '#666',
  success: '#4caf50',
  error: '#f44336',
  warning: '#FFA500',
  headerBg: '#444',
  headerTextColor: '#ffffff',
  borderColor: '#777',
  color: '#000000',
  rowHoverColor: '#ebebeb',
  rowAlternateColor: '#f5f5f5',
  rowHoverHighlight: '#e0f7fa',
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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: '12px',
  borderBottom: `1px solid ${themeColor.borderColor}`,
  padding: '6px 8px',
  textAlign: 'center',
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
    textAlign: 'center',
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

const DealREQ = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedDeal, setselectedDeal] = useState(null);
  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [showReconsiderPopup, setShowReconsiderPopup] = useState(false);
  const [showRejectPopup, setshowRejectPopup] = useState(false);


  const [password, setPassword] = useState('');
  const [reason, setReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  var pass = null;
  const [StatusId, setStatusId] = useState(null);


  const [statuses, setStatuses] = useState([]);
  const [res, setres] = useState([]);



  const statusupdate = async () => {
    try {
      const id = localStorage.getItem('id');
      const response = await axios.put(
        `${apilinkmain}/statusdll/${selectedDeal.id}`,
        {}, // Your data object
        { withCredentials: true, headers: { status: StatusId, userid: id ,} } // Config object
      );
    } catch (apiError) {
      console.error('API Error:', apiError);
      Swal.fire({
        icon: 'error',
        title: 'Server Error',
        text: 'An error occurred while updating the status. Please try again later.',
        confirmButtonColor: themeColor.error,
        confirmButtonText: 'OK',
      });
    }
  };


  const handlePasswordSubmit = async () => {
    setIsProcessing(true);
    await getpassword(); // Fetch the stored hash

    setTimeout(async () => {
      try {
        const match = await bcrypt.compare(password, pass); // Compare the user-entered password with the hash

        if (!match) {
          setIsProcessing(false);
          return Swal.fire({
            icon: 'error',
            title: 'Invalid Credentials',
            text: 'Invalid username or password',
            confirmButtonColor: themeColor.error,
            confirmButtonText: 'Try Again',
          });
        } else {
          setShowPasswordPopup(false);
          setShowDetailPopup(false);
          statusupdate();

          await Swal.fire({
            icon: 'success',
            title: 'Action Successful!',
            text: 'The action has been completed successfully.',
            confirmButtonColor: themeColor.success,
            confirmButtonText: 'OK',
          });

          // Update status after successful password validation



        }
      } catch (error) {
        console.error('Error during password comparison:', error);
      } finally {
        setIsProcessing(false);
        setPassword('');
        fetchdealRequest();
      }
    }, 1000);
  };

  const loadreconsideration = async () => {
    try {
      // const response = await axios.get(`${apilinkmain}/resdll`, { withCredentials: true });
      // setres(response.data);
      // console.log(res)
    } catch (error) {
      // Swal.fire('Error', 'Feild to fetch', 'error');
    }
  };

  const getpassword = async () => {
    const id = localStorage.getItem('id');
    try {
      const response = await axios.get(`${apilinkmain}/pass`, {
        withCredentials: true,
        headers: { id: id },
      });
      pass = response.data; // assuming response contains the hash

    } catch (error) {
      console.error('Error fetching password:', error);
      Swal.fire('Error', 'Failed to fetch data.', 'error');
    }
  };

  const addreason = async () => {
    try {
      const response = await axios.post(
        `${apilinkmain}/reasondll`,
        {}, // Your data object
        { withCredentials: true, headers: { id: selectedDeal.id, reason: reason } } // Config object
      );
    } catch (apiError) {
      console.error('API Error:', apiError);
      Swal.fire({
        icon: 'error',
        title: 'Server Error',
        text: 'An error occurred while updating the status. Please try again later.',
        confirmButtonColor: themeColor.error,
        confirmButtonText: 'OK',
      });
    }
  };
  const handleReconsiderSubmit = async () => {
    setIsProcessing(true);
    await getpassword(); // Fetch the stored hash

    setTimeout(async () => {
      try {
        const match = await bcrypt.compare(password, pass); // Compare the user-entered password with the hash

        if (!match || reason == '') {
          setIsProcessing(false);
          return Swal.fire({
            icon: 'error',
            title: 'Invalid Credentials',
            text: 'Invalid password',
            confirmButtonColor: themeColor.error,
            confirmButtonText: 'Try Again',
          });
        } else {
          setShowReconsiderPopup(false);
          setShowDetailPopup(false);
          addreason();
          statusupdate();
          fetchdealRequest();
          loadreconsideration();
          await Swal.fire({
            icon: 'success',
            title: 'Action Successful!',
            text: 'The action has been completed successfully.',
            confirmButtonColor: themeColor.success,
            confirmButtonText: 'OK',
          });

          // Update status after successful password validation

        }
      } catch (error) {
        console.error('Error during password comparison:', error);
      } finally {
        fetchdealRequest();
        setIsProcessing(false);
        setPassword('');
        setReason('');

      }
    }, 1000);
  };


  const handleRejectSubmit= async()=>{
    setIsProcessing(true);
    await getpassword(); 
    setTimeout(async () => {
      try {
        const match = await bcrypt.compare(password, pass); // Compare the user-entered password with the hash

        if (!match || reason == '') {
          setIsProcessing(false);
          return Swal.fire({
            icon: 'error',
            title: 'Invalid Credentials',
            text: 'Invalid password',
            confirmButtonColor: themeColor.error,
            confirmButtonText: 'Try Again',
          });
        } else {
          setshowRejectPopup(false);
          setShowDetailPopup(false);
          addreason();
          statusupdate();
          fetchdealRequest();
          loadreconsideration();
          await Swal.fire({
            icon: 'success',
            title: 'Action Successful!',
            text: 'The action has been completed successfully.',
            confirmButtonColor: themeColor.success,
            confirmButtonText: 'OK',
          });

          // Update status after successful password validation

        }
      } catch (error) {
        console.error('Error during password comparison:', error);
      } finally {
        fetchdealRequest();
        setIsProcessing(false);
        setPassword('');
        setReason('');

      }
    }, 1000);
  }
  const handleRowClick = (vendor) => {
    setselectedDeal(vendor);
    setShowDetailPopup(true);
  };

  useEffect(() => {
    fetchdealRequest();
    loadreconsideration();

  }, [])
  const fetchdealRequest = async () => {
    const id = localStorage.getItem('id');

    if (!id) {
      Swal.fire('Error', 'No ID found in local storage', 'error');
      return;
    }

    try {
      const response = await axios.get(`${apilinkmain}/deal`, {
        withCredentials: true,
      });
      // console.log(response.data);

      setData(response.data);
    } catch (error) {
      console.error('Error fetching promo data:', error); // Log error for debugging
      Swal.fire('Error', 'Failed to fetch data. Please try again later.', 'error');
    }
  };

  const getresById = (id) => {
    const re = res.find((data) => data.dealregistration_id === id);
    return re ? re.reason : '--';
  };
  const handleCloseDetailPopup = () => {
    setShowDetailPopup(false);
    setselectedDeal(null);
  };

  const handleRejectClick = () => {
    setStatusId(3);
    setshowRejectPopup(true);
  };

  const handleValidateClick = () => {
    setStatusId(2);
    setShowPasswordPopup(true);
  };

  const handleReconsiderClick = () => {
    setStatusId(2);
    setShowReconsiderPopup(true);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };


  const handleClosePasswordPopup = () => {
    setShowPasswordPopup(false);
    setPassword('');
  };

  const handleCloseReconsiderPopup = () => {
    setShowReconsiderPopup(false);
    setPassword('');
    setReason('');
  };

  const handleCloseRejectrPopup = () => {
    setshowRejectPopup(false);
    setPassword('');
    setReason('');
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const filteredData = data.filter((deal) => {
    const matchesSearch =
      deal.companyname.toLowerCase().includes(searchQuery) ||
      deal.email.toLowerCase().includes(searchQuery) ||
      deal.projectname.includes(searchQuery)

    const matchesStatus =
      statusFilter === 'All' || deal.deal_status_name === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <Box sx={{ padding: 2, overflowY: 'hidden', marginTop: '-20px' }}>
      <TitleTypography variant="h5">New Deal Request</TitleTypography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
        <TextField
          label="Search"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ width: '40%' }}
        />
        <Select
          value={statusFilter}
          onChange={handleStatusFilterChange}
          sx={{ width: '20%' }}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Approved">Approved</MenuItem>
          <MenuItem value="Rejected">Rejected</MenuItem>
          <MenuItem value="Reconsider">Reconsider</MenuItem>
        </Select>
      </Box>
      <TableContainer
        component={Paper}
        sx={{
          overflow: 'auto',
          height: '450px',
          marginBottom: '20px',
          borderRadius: '8px',
          boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
        }}
      >
        <Table stickyHeader>
          <StyledTableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Company Name</StyledTableCell>
              <StyledTableCell>Project Name</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>

              <StyledTableCell>closetimeline</StyledTableCell>
              <StyledTableCell>Type</StyledTableCell>
              <StyledTableCell>Product</StyledTableCell>

              <StyledTableCell>Budget Value</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {filteredData.map((deal, index) => (
              <StyledTableRow
                key={deal.id}
                onClick={() => handleRowClick(deal)}
              >
                <StyledTableCell>{index + 1}</StyledTableCell>
                <StyledTableCell>{deal.companyname}</StyledTableCell>
                <StyledTableCell>{deal.projectname}</StyledTableCell>
                <StyledTableCell>{deal.email}</StyledTableCell>
                <StyledTableCell>{deal.closetimeline}</StyledTableCell>
                <StyledTableCell>{deal.type_name}</StyledTableCell>
                <StyledTableCell>{deal.product_name}</StyledTableCell>

                <StyledTableCell>{deal.currency_name} {deal.budget} /-</StyledTableCell>
                <StyledTableCell
                  sx={{
                    color:
                      deal.deal_status_name === 'Approved'
                        ? themeColor.success
                        : deal.deal_status_name === 'Rejected'
                          ? themeColor.error
                          : deal.deal_status_name === 'Pending'
                            ? themeColor.warning
                            : deal.deal_status_name === 'Reconsider'
                              ? themeColor.info // Assuming you have a color for reconsider, use themeColor.info or another predefined color
                              : themeColor.color, // Default color
                    fontWeight:
                      deal.deal_status_name === 'Pending' || deal.deal_status_name === 'Reconsider'
                        ? 'bold'
                        : 'normal',
                  }}
                >

                  {deal.deal_status_name}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Detailpopup */}
      <Dialog
        open={showDetailPopup}
        onClose={handleCloseDetailPopup}
        PaperProps={{
          style: {
            width: '600px',
            borderRadius: '8px',
            boxShadow: '0px 3px 6px rgba(0,0,0,0.2)',
          },
        }}
        TransitionComponent={Zoom}
        TransitionProps={{ timeout: 400 }}
      >
        <DialogContent>
          {selectedDeal && (
            <>
              <DetailTypography variant="h6">
                Opportunity Details
              </DetailTypography>
              <Table>
                <TableBody>
                  <TableRow>
                    <DetailTableCell>Project Name:</DetailTableCell>
                    <DetailTableCell>
                      {selectedDeal.projectname}
                    </DetailTableCell>
                  </TableRow>
                  <TableRow>
                    <DetailTableCell>Company Name:</DetailTableCell>
                    <DetailTableCell>
                      {selectedDeal.companyname}
                    </DetailTableCell>
                  </TableRow>
                  <TableRow>
                    <DetailTableCell>Email:</DetailTableCell>
                    <DetailTableCell>
                      {selectedDeal.email}
                    </DetailTableCell>
                  </TableRow>
                  <TableRow>
                    <DetailTableCell>Designation:</DetailTableCell>
                    <DetailTableCell>
                      {selectedDeal.designation}
                    </DetailTableCell>
                  </TableRow>

                </TableBody>
              </Table>

              <DetailTypography variant="h6">
                Product Information
              </DetailTypography>
              <Table>
                <TableBody>
                  <TableRow>
                    <DetailTableCell>Selected Product:</DetailTableCell>
                    <DetailTableCell>
                      {selectedDeal.product_name}
                    </DetailTableCell>
                  </TableRow>
                  <TableRow>
                    <DetailTableCell>Closing Date:</DetailTableCell>
                    <DetailTableCell>
                      {selectedDeal.closetimeline}
                    </DetailTableCell>
                  </TableRow>
                  <TableRow>
                    <DetailTableCell>Competitor:</DetailTableCell>
                    <DetailTableCell>
                      {selectedDeal.compititor}
                    </DetailTableCell>
                  </TableRow>
                  <TableRow>
                    <DetailTableCell>Email:</DetailTableCell>
                    <DetailTableCell>
                      {selectedDeal.email}
                    </DetailTableCell>
                  </TableRow>
                  <TableRow>
                    <DetailTableCell>Currency:</DetailTableCell>
                    <DetailTableCell>
                      {selectedDeal.currency_name}
                    </DetailTableCell>
                  </TableRow>

                  <TableRow>
                    <DetailTableCell>budget Value:</DetailTableCell>
                    <DetailTableCell>
                      {selectedDeal.budget}
                    </DetailTableCell>
                  </TableRow>
                  <TableRow>
                    <DetailTableCell>Type:</DetailTableCell>
                    <DetailTableCell>
                      {selectedDeal.type_name}
                    </DetailTableCell>
                  </TableRow>

                </TableBody>
              </Table>

              <DetailTypography variant="h6">
                Remarks
              </DetailTypography>
              <Table>
                <TableBody>
                  <TableRow>
                    <DetailTableCell>Special Request:</DetailTableCell>
                    <DetailTableCell>
                      {selectedDeal.specialrequest}
                    </DetailTableCell>
                  </TableRow>
                  <TableRow>
                    <DetailTableCell>Reason:</DetailTableCell>
                    <DetailTableCell>
                      {selectedDeal.reason}
                    </DetailTableCell>
                  </TableRow>
                  {/* {selectedDeal.deal_status_name === 'Rejected' && (
                    <TableRow>
                      <DetailTableCell>Reconsideration:</DetailTableCell>
                      <DetailTableCell>
                        {getresById(selectedDeal.id)}
                      </DetailTableCell>
                    </TableRow>

                  )} */}

                </TableBody>
              </Table>
            </>
          )}
        </DialogContent>
        <DialogActions>
          {selectedDeal && selectedDeal.deal_status_name === 'Pending' && (
            <>
              <PremiumButton
                variant="outlined"
                color="error"
                onClick={handleRejectClick}
              >
                Reject
              </PremiumButton>
              <PremiumButton
                variant="contained"
                onClick={handleValidateClick}
              >
                Approved
              </PremiumButton>
            </>
          )}
          {selectedDeal && selectedDeal.deal_status_name === 'Rejected' && (
            <PremiumButton
              variant="contained"
              onClick={handleReconsiderClick}
            >
              Reconsider
            </PremiumButton>
          )}
          <PremiumButton
            variant="outlined"
            color="error"
            onClick={handleCloseDetailPopup}
          >
            Cancel
          </PremiumButton>
        </DialogActions>
      </Dialog>


      {/* Password Pop up  */}
      <Dialog
        open={showPasswordPopup}
        onClose={handleClosePasswordPopup}
        PaperProps={{
          style: {
            width: '300px',
            borderRadius: '8px',
            boxShadow: '0px 3px 6px rgba(0,0,0,0.2)',
          },
        }}
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'up', timeout: 400 }}
      >
        <DialogContent>
          <DetailTypography variant="h6">Enter Password</DetailTypography>
          <TextField
            autoFocus
            fullWidth
            label="Password"
            type={passwordVisible ? 'text' : 'password'}
            variant="outlined"
            value={password}
            onChange={handlePasswordChange}
            sx={{ marginBottom: '12px' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PasswordIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility}>
                    <VisibilityIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {isProcessing && <CircularProgress />}
        </DialogContent>
        <DialogActions>
          <PremiumButton
            variant="outlined"
            color="error"
            onClick={handleClosePasswordPopup}
          >
            Cancel
          </PremiumButton>
          <PremiumButton variant="contained" onClick={handlePasswordSubmit}>
            Submit
          </PremiumButton>
        </DialogActions>
      </Dialog>



      {/* Reconsideration */}
      <Dialog
        open={showReconsiderPopup}
        onClose={handleCloseReconsiderPopup}
        PaperProps={{
          style: {
            width: '400px',
            borderRadius: '8px',
            boxShadow: '0px 3px 6px rgba(0,0,0,0.2)',
          },
        }}
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'up', timeout: 400 }}
      >
        <DialogContent>
          <DetailTypography variant="h6">Reconsideration</DetailTypography>
          <TextField
            autoFocus
            fullWidth
            label="Password"
            type={passwordVisible ? 'text' : 'password'}
            variant="outlined"
            value={password}
            onChange={handlePasswordChange}
            sx={{ marginBottom: '12px' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PasswordIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility}>
                    <VisibilityIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Reason"
            variant="outlined"
            value={reason}
            onChange={handleReasonChange}
            sx={{ marginBottom: '12px' }}
            multiline
            rows={3}
          />
          {isProcessing && <CircularProgress />}
        </DialogContent>
        <DialogActions>
          <PremiumButton
            variant="outlined"
            color="error"
            onClick={handleCloseReconsiderPopup}
          >
            Cancel
          </PremiumButton>
          <PremiumButton variant="contained" onClick={handleReconsiderSubmit}>
            Submit
          </PremiumButton>
        </DialogActions>
      </Dialog>

     
      {/* Reject */}
      <Dialog
        open={showRejectPopup}
        onClose={handleCloseRejectrPopup}
        PaperProps={{
          style: {
            width: '400px',
            borderRadius: '8px',
            boxShadow: '0px 3px 6px rgba(0,0,0,0.2)',
          },
        }}
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'up', timeout: 400 }}
      >
        <DialogContent>
          <DetailTypography variant="h6">Reject</DetailTypography> {/* Updated title */}
          <TextField
            autoFocus
            fullWidth
            label="Password"
            type={passwordVisible ? 'text' : 'password'}
            variant="outlined"
            value={password}
            onChange={handlePasswordChange}
            sx={{ marginBottom: '12px' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PasswordIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility}>
                    <VisibilityIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Reason"
            variant="outlined"
            value={reason}
            onChange={handleReasonChange}
            sx={{ marginBottom: '12px' }}
            multiline
            rows={3}
          />
          {isProcessing && <CircularProgress />}
        </DialogContent>
        <DialogActions>
          <PremiumButton
            variant="outlined"
            color="error"
            onClick={handleCloseRejectrPopup} // Correct function to close the dialog
          >
            Cancel
          </PremiumButton>
          <PremiumButton variant="contained" onClick={handleRejectSubmit}>
            Submit
          </PremiumButton>
        </DialogActions>
      </Dialog>


    </Box>
  );
};

export default DealREQ;

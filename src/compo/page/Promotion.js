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

const Promotion = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [showReconsiderPopup, setShowReconsiderPopup] = useState(false);
  const [password, setPassword] = useState('');
  const [reason, setReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  var pass = null;
  const [StatusId, setStatusId] = useState(null);


  const [statuses, setStatuses] = useState([]);
  const [res, setres] = useState([]);

  useEffect(() => {
    fetchPromoRequest();
    loadStatus();
    // loadreconsideration();

  }, [])
  const getStatusById = (id) => {
    const status = statuses.find((status) => status.id === id);
    return status ? status.name : ' not found';
  };

  const getresById = (id) => {
    const re = res.find((status) => status.promoreqid === id);
    return re ? re.reason : 'not';
  };

  const fetchPromoRequest = async () => {
    const id = localStorage.getItem('id');

    if (!id) {
      Swal.fire('Error', 'No ID found in local storage', 'error');
      return;
    }

    try {
      const response = await axios.get(`${apilinkmain}/promo`, {
        withCredentials: true,
        headers: { id: id },
      });

      setData(response.data);
    } catch (error) {
      console.error('Error fetching promo data:', error); // Log error for debugging
      Swal.fire('Error', 'Failed to fetch data. Please try again later.', 'error');
    }
  };


  //Promotion
  // const loadPromo = async () => {
  //   try{
  //     const response = await axios.get(`${apilinkmain}/promo`, {withCredentials: true});
  //     setPromotion(response.data);
  //   }catch (error){
  //     Swal.fire('Error', 'Feild to fetch' , 'error');
  //   }
  // };

  // product


  // PromoReq


  // status
  const loadStatus = async () => {
    try {
      const response = await axios.get(`${apilinkmain}/status`, { withCredentials: true });
      setStatuses(response.data);
    } catch (error) {
      Swal.fire('Error', 'Feild to fetch', 'error');
    }

  };
  // const loadreconsideration = async () => {
  //   try {
  //     const response = await axios.get(`${apilinkmain}/res`, { withCredentials: true });
  //     setres(response.data);
  //   } catch (error) {
  //     Swal.fire('Error', 'Feild to fetch', 'error');
  //   }

  // };


  const statusupdate = async () => {
    if (!selectedVendor || !selectedVendor.id) {
      console.error('Selected vendor or prtid is undefined');
      return;
    }
  
    try {
      console.log("StatusId:", StatusId);
      console.log("Vendor ID (prtid):", selectedVendor.id);
  
      const response = await axios.put(
        `${apilinkmain}/status/${selectedVendor.id}`,
        {}, // Assuming the data to update is in headers, update if necessary
        { withCredentials: true, headers: { status: StatusId } }
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
  
 
  const addreason = async () => {
    try {

      const response = await axios.post(
        `${apilinkmain}/reason`,
        {}, // Your data object
        { withCredentials: true, headers: { id: selectedVendor.id, reason: reason } } // Config object
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


  const handleRowClick = (vendor) => {
    setSelectedVendor(vendor);
    setShowDetailPopup(true);
  };

  const handleCloseDetailPopup = () => {
    setShowDetailPopup(false);
    setSelectedVendor(null);
  };

  const handleRejectClick = () => {
    setStatusId(3);
    setShowPasswordPopup(true);
  };

  const handleValidateClick = () => {
    setStatusId(2);
    setShowPasswordPopup(true);
  };

  const handleReconsiderClick = () => {
    setStatusId(4);
    setShowReconsiderPopup(true);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleReasonChange = (e) => {
    setReason(e.target.value);
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
        fetchPromoRequest();
      }
    }, 1000);
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
          fetchPromoRequest();
          // loadreconsideration();
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
        fetchPromoRequest();
        setIsProcessing(false);
        setPassword('');
        setReason('');

      }
    }, 1000);
  };



  const handleReconsiderSubmit1 = () => {
    setIsProcessing(true);
    setTimeout(() => {
      if (password === '12345' && reason !== '') {
        setShowReconsiderPopup(false);
        setShowDetailPopup(false);
        Swal.fire({
          icon: 'success',
          title: 'Reconsideration Successful!',
          text: 'The record has been moved to pending status.',
          confirmButtonColor: themeColor.success,
          confirmButtonText: 'OK',
        }).then(() => {
          setSelectedVendor((prev) => ({
            ...prev,
            status: 'Pending',
          }));
        });
      } else if (reason === '') {
        setShowReconsiderPopup(false);
        setShowDetailPopup(false);
        Swal.fire({
          icon: 'error',
          title: 'Reason Required',
          text: 'Please provide a reason for reconsideration.',
          confirmButtonColor: themeColor.error,
          confirmButtonText: 'OK',
        });
      } else {
        setShowReconsiderPopup(false);
        setShowDetailPopup(false);
        Swal.fire({
          icon: 'error',
          title: 'Incorrect Password',
          text: 'The password you entered is incorrect.',
          confirmButtonColor: themeColor.error,
          confirmButtonText: 'Try Again',
        });
      }
      setIsProcessing(false);
      setPassword('');
      setReason('');
    }, 1000);
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

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const filteredData = data.filter((promorequests) => {
    const matchesSearch =
      promorequests.promotion_name.toLowerCase().includes(searchQuery) ||
      promorequests.product_name.toLowerCase().includes(searchQuery) ||
      promorequests.company_name.toLowerCase().includes(searchQuery) ||
      promorequests.company_email.toLowerCase().includes(searchQuery) ||
      promorequests.company_telephone.includes(searchQuery)


    const matchesStatus =
      statusFilter === 'All' || promorequests.request_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <Box sx={{ padding: 2, overflowY: 'hidden', marginTop: '-20px' }}>
      <TitleTypography variant="h5">New Promotion Request</TitleTypography>
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
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Mobile No</StyledTableCell>
              <StyledTableCell>Product Name</StyledTableCell>
              <StyledTableCell>Prormo Title</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {filteredData.map((promorequest, index) => (
              <StyledTableRow
                key={promorequest.id}
                onClick={() => handleRowClick(promorequest)}
              >
                <StyledTableCell>{index + 1}</StyledTableCell>
                <StyledTableCell>{promorequest.company_name}</StyledTableCell>
                <StyledTableCell>{promorequest.company_email}</StyledTableCell>
                <StyledTableCell>{promorequest.company_telephone}</StyledTableCell>
                <StyledTableCell>{promorequest.product_name}</StyledTableCell>
                <StyledTableCell>{promorequest.promotion_name}</StyledTableCell>


                <StyledTableCell
                  sx={{
                    color:
                      promorequest.request_status === 'Approved'
                        ? themeColor.success
                        : promorequest.request_status === 'Rejected'
                          ? themeColor.error
                          : promorequest.request_status === 'Pending'
                            ? themeColor.warning
                            : promorequest.request_status === 'Reconsider'
                              ? themeColor.info
                              : themeColor.color,
                    fontWeight: promorequest.request_status === 'Pending' ? 'bold' : 'normal',
                  }}
                >
                  {promorequest.request_status}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
          {selectedVendor && (
            <>
              <DetailTypography variant="h6">
                Company Information
              </DetailTypography>
              <Table>
                <TableBody>
                  <TableRow>
                    <DetailTableCell>Company Name:</DetailTableCell>
                    <DetailTableCell>
                      {selectedVendor.company_name}
                    </DetailTableCell>
                  </TableRow>

                  <TableRow>
                    <DetailTableCell>Company Email:</DetailTableCell>
                    <DetailTableCell>
                      {selectedVendor.company_email}
                    </DetailTableCell>
                  </TableRow>
                  <TableRow>
                    <DetailTableCell>Partner Phone No:</DetailTableCell>
                    <DetailTableCell>
                      {selectedVendor.company_telephone}
                    </DetailTableCell>
                  </TableRow>

                </TableBody>
              </Table>

              <DetailTypography variant="h6">
                Promotion Information
              </DetailTypography>

              <img
                src={`${apilinkmain}${selectedVendor.proimage}`}
                alt="Uploaded Image"
                style={{
                  height: '200px',
                  objectFit: 'cover',
                  textAlign: 'center',
                  marginBottom: '20px',
                  marginLeft: '23%',
                }}
              />
              <Table>
                <TableBody>
                  <TableRow>
                    <DetailTableCell>Product Name:</DetailTableCell>
                    <DetailTableCell>
                      {selectedVendor.product_name}
                    </DetailTableCell>
                  </TableRow>
                  <TableRow>
                    <DetailTableCell>Promotion Title:</DetailTableCell>
                    <DetailTableCell>
                      {selectedVendor.promotion_name}
                    </DetailTableCell>
                  </TableRow>
                  <TableRow>
                    <DetailTableCell>Status:</DetailTableCell>
                    <DetailTableCell>
                      {selectedVendor.request_status}
                    </DetailTableCell>
                  </TableRow>

                  <TableRow>
                    <DetailTableCell>Reason:</DetailTableCell>
                    <DetailTableCell>
                      {selectedVendor.note}
                    </DetailTableCell>
                  </TableRow>

                </TableBody>
              </Table>


            </>
          )}
        </DialogContent>
        <DialogActions>
          {selectedVendor && selectedVendor.request_status === 'Pending' && (
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
          {selectedVendor && selectedVendor.request_status === 'Rejected' && (
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
            required
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
    </Box>
  );
};

export default Promotion;

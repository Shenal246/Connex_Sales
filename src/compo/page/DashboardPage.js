import React, { useEffect, useState } from 'react';
import {
  Container, Grid, Paper, Typography, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, Card, CardMedia, CardContent
} from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { styled } from '@mui/system';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Swal from "sweetalert2";
import axios from "axios";
import APIConnection from "../../config";
import { Link } from 'react-router-dom';
import { apilinkmain } from '../../API';
// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Color theme
const themeColor = {
  primary: '#1565C0',
  secondary: '#FF4081',
  background: '#f5f5f5',
  cardBackground: '#ffffff',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#29b6f6',
};

// Orange color for pending status
const pendingStatusColor = '#FFB74D';

// Styled Paper component
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '12px',
  background: themeColor.cardBackground,
  boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
}));

// Styling for product cards
const ProductCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.15)',
}));

// Styling for cards
const StatCard = styled(Paper)(({ theme, bgcolor }) => ({
  padding: theme.spacing(3),
  borderRadius: '12px',
  textAlign: 'center',
  backgroundColor: bgcolor,
  color: '#fff',
  boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.15)',
}));

// APIConnection
const getPromoRqapi = APIConnection.salesDashboardapi;



const DashboardPage = () => {
  const [dashboardDetails, setDashboardDetails] = useState([]);


  const partnerRequestData = {
    labels: ['Pending', 'Approved', 'Rejected', 'Reconsidered'],
    datasets: [
      {
        label: 'Product Requests',
        data: [dashboardDetails.partnerRequestStatus?.pending, dashboardDetails.partnerRequestStatus?.approved, dashboardDetails.partnerRequestStatus?.rejected, dashboardDetails.partnerRequestStatus?.reconsider], // Sample data for partner request counts
        backgroundColor: ['#FFB74D', '#4CAF50', '#F44336', 'blue'],
        hoverOffset: 4,
      },
    ],
  };

  const fetchDashboradData = async () => {
    try {
      const response = await axios.get(getPromoRqapi, {
        withCredentials: true,
      });

      setDashboardDetails(response.data);
    } catch (error) {
      console.error("Error loading partnercount:", error);
    }
  };





  useEffect(() => {
    fetchDashboradData();

  }, []);

  return (
    <Container maxWidth="lg" style={{ marginBottom: '50px' }}>
      {/* Dashboard Title */}
      <Typography gutterBottom style={{ fontWeight: 700, marginBottom: '20px', fontSize: '25px' }}>
        Welcome to the Sales Dashboard!
      </Typography>

      <Grid container spacing={4}>
        {/* Donut Chart on the Left */}
        <Grid item xs={12} md={5}>
          <StatCard style={{ marginBottom: '10px' }}>
            <Typography style={{ color: 'Black', fontSize: '20px' }}>Hi {dashboardDetails?.userName} ! 👋</Typography>
          </StatCard>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Product Request Status
            </Typography>
            {/* Reduced size of the Donut Chart */}
            <Box sx={{ maxWidth: '85%', margin: 'auto' }}>
              <Doughnut data={partnerRequestData} />
            </Box>
          </StyledPaper>
        </Grid>

        {/* Top Requested Products Section */}
        <Grid item xs={12} md={7}>
          <Typography variant="h6" gutterBottom>
            Top Requested Products
          </Typography>
          <Grid container spacing={3}>
            {dashboardDetails && dashboardDetails.salesdata && dashboardDetails.salesdata.length > 0 ? (
              dashboardDetails.salesdata.map((product, index) => (
                <Grid item xs={12} sm={4} key={index + 1}> {/* Each card takes 4 out of 12 columns */}
                  <ProductCard>
                    <CardMedia
                      component="img"
                      height="120"
                      image={`${apilinkmain}${product.image}`} // Correct usage of image prop
                      style={{
                        objectFit: 'contain', // Ensures the image fits within the container without being cropped
                      }}
                    />
                    <CardContent>
                      <Typography variant="body2" color="textSecondary">
                        Model: {product.modelno}
                      </Typography>
                      <Typography variant="body2" color="textPrimary" style={{ fontWeight: 600 }}>
                        Requested Amount: {product.request_count}
                      </Typography>
                    </CardContent>
                  </ProductCard>
                </Grid>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">
                No sales data available.
              </Typography>
            )}

          </Grid>

          {/* New Partner Requests Table */}
          <Box mt={4} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" gutterBottom>
              New Deal Requests
            </Typography>
            {/* View Button next to the title */}
            {/* <Link to={'/vnmgt'}>
              <Button variant="contained" color="primary" size="small">
                View
              </Button>
            </Link> */}
          </Box>

          <TableContainer component={Paper} sx={{ boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Company Name</strong></TableCell>
                  <TableCell><strong>Budget</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Request Date</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dashboardDetails && Array.isArray(dashboardDetails.dealrequetsdata) && dashboardDetails.dealrequetsdata.length > 0 ? (
                  dashboardDetails.dealrequetsdata.map((request, index) => (
                    <TableRow key={index + 1}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{request.companyname}</TableCell>
                      <TableCell> {request.currency} {request.budget} </TableCell>
                      <TableCell>
                        <span style={{ color: pendingStatusColor, fontWeight: 'bold' }}>
                          {request.deal_status_name}
                        </span>
                      </TableCell>
                      <TableCell>{request.date}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">No deal requests available</TableCell>
                  </TableRow>
                )}
              </TableBody>

            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;


// const mainlink='https://systemapi.connexit.biz';
const mainlink = 'http://192.168.13.249:3001';

const config = {
    loginapi: `${mainlink}/stafflogin`,
    changePasswordApi: `${mainlink}/change-password-staff`,
    verifytoken: `${mainlink}/verifytoken`,
    logoutapi: `${mainlink}/stafflogout`,
    salesDashboardapi: `${mainlink}/get-salesDashboardDetails`,
    getstaffdetailsapi: `${mainlink}/getstaffdetailsapi`,
    // /get-salesDashboardDetails
    mainapi: `${mainlink}`,


};

export default config;
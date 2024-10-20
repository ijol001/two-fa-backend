import express from "express";
const router = express.Router({ mergeParams: true });
import userLogin from "../controllers/userLogin.js";
import checkUserAuth from "../middleware/authMiddleware.js";
import cors from "cors";
import loggedUser from "../controllers/loggedUser.js";
import userReg from "../controllers/userReg.js"
import verifyOTP from "../controllers/verifyOTP.js";
import verifyLoginOTP from "../controllers/verifyLoginOTP.js";


router.use('/loggedUser',checkUserAuth);

//public Routes
// router.post('/generate-otp', cors(), generateOTP);
router.post('/login', cors(), userLogin);
router.post('/reg', cors(), userReg);
router.post('/verify-otp', cors(), verifyOTP);
router.post('/verify-login-otp', cors(), verifyLoginOTP)

//protected Routes 
router.get('/loggedUser', loggedUser);

export default router;

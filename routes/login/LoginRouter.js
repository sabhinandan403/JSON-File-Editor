/**
 * Project Name : Inventory Management System 
 * @company YMSLI
 * @author  Abhinandan Kumar
 * @date    19 Jan 2024
 * Copyright (c) 2024, Yamaha Motor Solutions (INDIA) Pvt Ltd.
 * 
 * Module : Login
 * Description
 * ----------------------------------------------------------------------------------- 
 * Routes to login and logout of the application
 * 
 * This module has following routes:
 * 1. / {GET}                   - To get register screen
 * 2. /login  {GET}             - To get login screen
 * 3. /register {POST}          - To register user details and create default json file
 * 4. /validate {GET}          - To check user credentials when logging in
 * 5. redirectHome              - To redirect to home page if session exists
 * -----------------------------------------------------------------------------------
 * 
 * Revision History
 * ---------------request objectuest object-----------------------------------------------------------------
 * Modified By               Modified On         Description
 * Abhinandan Kumar          19 Jan 2024         Initially Created & added routes
 * -----------------------------------------------------------------------------------
 */
var express = require('express');
var path = require('path')
var loginService = require('../../service/login/LoginService')
var router = express.Router();
const jwtMiddleware = require('../../middleware/jwtMiddleware');
const { authorize } = require('../../middleware/authorizeMiddleware')
const message = require('../../message/message');


/**
 * @description To show register screen
 * @param  {} req
 * @param  {} response
 */
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../views/registeruser.html'));

})

/**
 * @description To show login screen
 * @param  {} req
 * @param  {} response
 */

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../../views/login.html'))
});

/**
 * @description To show home screen
 * @param  {} req
 * @param  {} response
 */

router.get('/home', authorize, (req, res) => {
    res.sendFile(path.join(__dirname, '../../views/home.html'))
});


/**
 * @description To register the user
 * @param  {} req
 * @param  {} response
 */
router.post('/register', async (req, res) => {
    //if data packet is empty
    if (!req.body) {
        return res.status(403).json({ success: false, message: message.REQUEST_DATA_NOT_FOUND });
    }
    try {
        var result = await loginService.RegisterUser(req.body);
        if (result.success) {
            //res.redirect('http:/localhost:3000/login')
            res.status(200).json({ success: true, data: result.data });
        } else {
            // Redirect to localhost:3000/login
            //return res.redirect(301, 'http://localhost:3000/login');
            return res.status(400).json({success:false,message:result.message});
        }
    } catch (error) {
        console.log("Error in connecting with the database ", error);
        res.status(500).json({ success: false, message: message.GET_ERROR });
    }
});

/**
 * @description To validate the user if it exists
 * @param  {} '/authenticate'
 * @param  {} jwtMiddleware
 * @param  {} req
 * @param  {} response
 * @param  {} next
 */
router.post('/validate', jwtMiddleware, async (req, res) => {
    var userdata = req.body;

    try {
        var result = await loginService.ValidateUser(userdata);
        if (result.success) {
            //Store jwt token in the session when user exists
            req.session.token = res.locals.token
            res.status(200).json({ success: true, data: result.data, token: res.locals.token });
        } else {
            res.status(401).json({ success: false, data: result.data,message: message.INCORRECT_PASSWORD });
        }
    } catch (error) {
        console.log("Error in connecting with the database ", error);
        res.status(500).json({ success: false, message: message.GET_ERROR });
    }
});

/**
 * @description To destroy session and redirect to login page
 * @param  {} req
 * @param  {} response
 */

router.get('/logout', (req, res) => {
    // Delete the token from req.session.token
    req.session.token = null; // or use delete req.session.token;

    // Optionally, you can destroy the entire session
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        // Set cache control headers to prevent caching
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        // Redirect or respond as needed
        res.redirect('/login');
    })
});


module.exports = router;
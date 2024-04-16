/**
 * Project Name : Inventory Management System
 * @company YMSLI
 * @author  Abhinandan Kumar
 * @date    Janaury 19, 2024
 * Copyright (c) 2024, Yamaha Motor Solutions (INDIA) Pvt Ltd.
 *
 * Module: License TCP Client
 * Description
 * -----------------------------------------------------------------------------------
 * Contains all the Middleware function.
 *
 * This module has following public functions:
 *
 * This module has following private functions:
 *
 * 1. authenticate              - Function to generate jwt token
 * -----------------------------------------------------------------------------------
 *
 * Revision History
 * -----------------------------------------------------------------------------------
 * Modified By              Modified On           Description
 * Abhinandan Kumar         January 19, 2024      Initially Created
 * -----------------------------------------------------------------------------------
 */


const jwt = require('jsonwebtoken');
const secretKey = 'yourSecretKey'; 

function generateToken(email) {
  return jwt.sign({ email }, secretKey, { expiresIn: '1h' }); // Token expires in 1 hour
}

function jwtMiddleware(req, res, next) {
  // Assuming the username is available in req.body after authentication
  const { email } = req.body;

  if (email) {
    const token = generateToken(email);
    res.locals.token = token;
    next()
  }else{
    res.status(401).json({ success: false, message: 'Unauthorized: Username not provided' });
  }
}

module.exports = jwtMiddleware;
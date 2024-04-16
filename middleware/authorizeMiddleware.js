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

function authorize(req, res, next) {
    const storedToken = req.session.token;

    if (storedToken === false || storedToken === undefined) {
        res.status(401).json({ success: false, message: 'Unauthorized: Token not found or invalid' });
        return;
    }

    next();
}

module.exports = {authorize}

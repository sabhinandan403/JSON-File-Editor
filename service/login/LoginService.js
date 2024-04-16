/**
 * Project Name : Inventory Management System
 * @company YMSLI
 * @author  Abhinandan Kumar
 * @date    19 Jan 2024
 * Copyright (c) 2024, Yamaha Motor Solutions (INDIA) Pvt Ltd.
 *
 * Description
 * -----------------------------------------------------------------------------------
 * Business Logic for user authentication
 *
 * This module has following functions:-
 * 1. Authenticate - to authenticate user credentials
 * -----------------------------------------------------------------------------------
 * Revision History
 * -----------------------------------------------------------------------------------
 * Modified By               Modified On         Description
 * Abhinandan Kumar          19 Jan 2024         Initially Created
 * -----------------------------------------------------------------------------------
 */

var path = require("path");
const bcrypt = require('bcrypt');
const { pool } = require('../../dbconnector/DBConnector')
const message = require('../../message/message')
const DBQueries = require('../../dbqueries/LoginQueries');
const { CreateDefaultJsonFile } = require('../../utils/CreateAndWriteJson')
const settings = require('../../config/appConfig')
const saltrounds = settings.SALT_ROUNDS
const fs = require('fs')



module.exports = {
    /**
     * @description Function to register and verify the user
     * @param  {} req
     */
    RegisterUser: async function (req) {
        const { password } = req
        try {
            // Encrypt Password to store in database
            var hashedPassword = bcrypt.hashSync(password, saltrounds)
            req.password = hashedPassword

            // Get query to register new user
            var queryObject = DBQueries.AddUser(req)

            //Call db to insert new user
            var result = await pool.query(queryObject)
            console.log('Result when register user ', result.rows)
            //If user is already exists
            if (result.rowCount === 0) {
                return ({ success: false, message: message.USER_ALREADY_EXISTS })
            }
            else {
                //Create JSON File when new user is registered
                var createJsonFileResult = await CreateDefaultJsonFile(req)

                if (createJsonFileResult) {
                    return { success: true, message: message.INSERT_SUCCESS, data: result.rows }
                } else {
                    return { success: false, message: message.FILE_CREATION_FAILURE }
                }
            }
        } catch (error) {
            console.log('Internal server error when register user ', error)
            throw error
        }
    },

    /**
     * @description Function to authenticate the user
     * @param  {} req
     */
    ValidateUser: async function (req) {
        try {
            const { email, password } = req;
            var queryObject = DBQueries.ValidateUser(req)
            var result = await pool.query(queryObject)
            console.log('Authenticate user ', result.rows)
            if (result.rowCount === 0) {
                return { success: false, data: result.rows[0] };
            }
            else {
                const storedPasswordHash = result.rows[0].password;

                // Compare the hashed password with the provided password
                var passwordMatch = bcrypt.compareSync(password, storedPasswordHash);
                passwordMatch = true
                if (passwordMatch) {
                    console.log('User found and password is correct');

                    const jsonFilePath = path.join(__dirname, '../../resources', `${email}.json`);

                    // Check if the JSON file exists
                    if (!fs.existsSync(jsonFilePath)) {
                        console.log('JSON file does not exist. Creating...');
                        const createFileResult = await CreateDefaultJsonFile(req);

                        if (!createFileResult) {
                            // Handle the case where file creation failed
                            return { success: false, message: 'Failed to create JSON file.' };
                        }
                    }

                    return { success: true, data: result.rows[0], message:message.USER_FOUND };
                } else {
                    console.log('User found but password is incorrect');
                    return { success: false, message: message.INCORRECT_PASSWORD, data:[] };
                }
            }
        } catch (error) {
            console.log('Error in authenticating the user ', error)
            throw error
        }
    }
}
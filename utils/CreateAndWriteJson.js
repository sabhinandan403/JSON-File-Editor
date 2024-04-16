/**
 * Project Name : Material Information
 * @company YMSLI
 * @author  Sachin Avinaw
 * @date    Janaury 19,2024
 * Copyright (c) 2024, Yamaha Motor Solutions (INDIA) Pvt Ltd.
 *
 * Module: Application JSON File Editor
 * Description
 * -----------------------------------------------------------------------------------
 * Contains all the functions tp write json file
 *
 * This module has following public functions:
 * 1. createDefaultJsonFile           - To create a default json file when a user is registered
 *
 * -----------------------------------------------------------------------------------
 *
 * Revision History
 * -----------------------------------------------------------------------------------
 * Modified By             Modified On            Description
 * Abhinandan Kumar        Janaury 19,2024        Initially Created
 * -----------------------------------------------------------------------------------
 */

const settings = require('../config/appConfig')
const fs = require('fs')
const path = require('path')

module.exports = {
    /**
     * @description Function to create and write default json file
     * @param  {} req
     */
    CreateDefaultJsonFile: async function (req) {

        const fileName = `${req.email}.json`;
        const filePath = path.join(__dirname, '../resources', fileName);

        const dataToWrite = {
            DB_SERVER: settings.DB_SERVER,
            DB_PORT: settings.DB_PORT,
            DB_NAME: settings.DB_NAME,
            AMQP_IP: settings.AMQP_IP,
            ACTIVE_OUTPUT_MODULE: settings.ACTIVE_OUTPUT_MODULE,
            NETWORK_NAME: settings.NETWORK_NAME,
            MODE: settings.MODE,
            IS_TESTING_ENABLED: settings.IS_TESTING_ENABLED
        };

        try {
            //Create file at specified location
            fs.writeFileSync(filePath, JSON.stringify(dataToWrite, null, 2));
            return true
        } catch (error) {
            console.error('Error writing JSON file:', error);
            throw error
        }
    },

    /**
     * @description Function to rewrite a json file to update
     * @param  {} req
     */
    WriteJsonFile: async function (req) {
        const fileName = `${req.email}.json`;
        console.log(path.join(__dirname, '../resources', fileName))
        const filePath = path.join(__dirname, '../resources', fileName);

        try {
            // Create a copy of req excluding email
            const newData = { ...req };
            delete newData.email;
            // Remove null key-value pairs
            // Object.keys(newData).forEach((key) => newData[key] === null && delete newData[key]);
            Object.keys(newData).forEach((key) => {
                if (newData[key] === null) {
                    delete newData[key];
                } else {
                    const uppercaseKey = key.toUpperCase();
                    if (key !== uppercaseKey) {
                        newData[uppercaseKey] = newData[key];
                        delete newData[key];
                    }
                }
            });
    
            // Write the updated JSON file
            fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));

            console.log(`JSON file ${fileName} rewritten successfully.`);
            return true;  // Explicitly returning true on success
        } catch (error) {
            console.error('Error writing JSON file:', error);
            return false;
        }
    }


}

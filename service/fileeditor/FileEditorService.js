/**
 * Project Name : Inventory Management System
 * @company YMSLI
 * @author  Abhinandan Kumar
 * @date    January 19, 2024
 * Copyright (c) 2024, Yamaha Motor Solutions (INDIA) Pvt Ltd.
 *
 * Description
 * -----------------------------------------------------------------------------------
 * Bussines logic to execute command of CartID type
 *
 * This module has following public function :-

 * 1. GetProperty                - To get all prperty from the database.
 * 2. UpdateProperty             - To update property 
 * 3. AddProperty                - To add a property
 * 4. DeleteProperty             - To delete a property
 * 5. GetPropertyType            - TO get all property type from property type from property_type_master table
 * -----------------------------------------------------------------------------------
 * Revision History
 * -----------------------------------------------------------------------------------
 * Modified By           Modified On         Description
 * Abhinandan Kumar      19 Jan 2024         Initially created
 
 * -----------------------------------------------------------------------------------
 */
const path = require('path')
const { pool } = require('../../dbconnector/DBConnector')
const message = require('../../message/message')
const DBQuery = require('../../dbqueries/FileEditorQueries')
const { WriteJsonFile } = require('../../utils/CreateAndWriteJson')


module.exports = {
    /**
     * @description Function to get all properties from the database
     * @param  {} req
     */
    GetProperty: async function (req) {
        try {
            var queryObject = DBQuery.GetProperty(req)
            var result = await pool.query(queryObject)
            if (result.rowCount === 0) {
                return { success: false, message: message.GET_ERROR }
            }
            else {
                console.log('When getProperty operation :', result.rows[0])
                delete result.rows[0].user_id

                //Remove null value key from the result
                Object.keys(result.rows[0]).forEach(key => {
                    if (result.rows[0][key] === null) {
                        delete result.rows[0][key];
                    }
                });
                return { success: true, data: result.rows[0] }
            }
        }
        catch (error) {
            //logger.error(message.GET_ERROR, error)
            console.log("Error in getting product details ", error)
            throw error
        }
    },

    /**
     * @description Function to update property in the database
     * @param  {} req
     */
    UpdateProperty: async function (req) {
        const { user_id, columnname, newValue, property_type } = req

        // delete newProperties.user_id;
        // delete newProperties.email;
        dataForQuery = {}
        if (!property_type) {
            var dataForQuery = {
                user_id: user_id,
                columnname: columnname,
                newValue: newValue
            }
        } else {
            var dataForQuery = {
                user_id: user_id,
                columnname: columnname,
                newValue: newValue,
                property_type: property_type
            }
        }
        try {
            var queryObject = DBQuery.UpdateProperty(dataForQuery)
            var result = await pool.query(queryObject)
            if (result.rowCount === 0) {
                return { success: false, message: message.GET_ERROR }
            }
            else {
                console.log('the row after updateProperty operation is: ', result.rows[0])
                console.log('req.email :', req.email)
                var userData = {
                    ...result.rows[0],
                    email: req.email
                }
                delete userData.user_id
                console.log('userData for updateProperty is: ', userData)
                var writeJsonFileResult = await WriteJsonFile(userData)
                if (writeJsonFileResult) {
                    return { success: true, data: result.rows[0] }
                } else {
                    console.log('Error in updating json file')
                }
            }
        }
        catch (error) {
            console.log("Db updateProperty operation error: ", error)
            throw error
        }
    },

    /**
     * @description Function to add property in the table
     * @param  {} req
     */
    AddProperty: async function (req) {
        try {
            var queries = DBQuery.AddProperty(req);
            var result;
            for (const query of queries) {


                try {
                    if (typeof query === 'string') {
                        // Execute simple query
                        await pool.query(query);
                    } else if (query.text && query.values) {
                        // Execute parameterized query
                        result = await pool.query(query);
                    }

                } catch (queryError) {
                    console.error('Error executing query:', queryError);
                    // Handle the query error, log or throw if needed
                    throw queryError;
                }
            }
            if (result.rowCount === 0) {
                return { success: false, message: message.GET_ERROR };
            } else {
                if (req.newColumnValueType === 'ARRAY(CHECKBOXES)' || req.newColumnValueType === 'DROPDOWN') {
                    await AddPropertyType(req)
                    var userData = {
                        ...result.rows[0],
                        email: req.email,
                    };
                    delete userData.user_id;
                    console.log('userData for addProperty ', userData);
                    var writeJsonFileResult = await WriteJsonFile(userData);
                    if (writeJsonFileResult) {
                        console.log('the row after addProperty operation is:', result.rows[0]);
                        return { success: true, data: result.rows[0] };
                    } else {
                        console.log('Error in adding property to json file');
                    }

                } else {
                    var userData = {
                        ...result.rows[0],
                        email: req.email,
                    };
                    delete userData.user_id;
                    console.log('userData for addProperty ', userData);
                    var writeJsonFileResult = await WriteJsonFile(userData);
                    if (writeJsonFileResult) {
                        console.log('the row after addProperty operation is:', result.rows[0]);
                        return { success: true, data: result.rows[0] };
                    } else {
                        console.log('Error in adding property to json file');
                    }
                }
            }
        }
        catch (error) {
            // Handle any other unexpected errors
            console.log("Db addProperty operation error: ", error);
            throw error;
        }
    },

    /**
     * @description Function to add property in the table
     * @param  {} req
     */
    DeleteProperty: async function (req) {
        var data = req
        var { user_id, property_name } = req
        var userData = {
            user_id: user_id,
            columnname: property_name
        }
        try {
            var queryObject = DBQuery.DeleteProperty(userData)
            var result = await pool.query(queryObject)
            if (result.rowCount === 0) {
                return { success: false, message: message.GET_ERROR }
            }
            else {
                console.log('Result after deleteProperty operation :', result.rows[0])
                await DeletePropertyType(data)
                var userData = {
                    ...result.rows[0],
                    email: req.email
                }
                delete userData.user_id
                console.log('userData for the deleteProperty operation is: ', userData)
                var writeJsonFileResult = WriteJsonFile(userData)
                if (writeJsonFileResult) {
                    //console.log('the row after deleteProperty operation is :', result.rows[0])
                    return { success: true, data: result.rows[0] }
                } else {
                    console.log('Error in deleting property from json file')
                }
            }
        }
        catch (error) {
            //logger.error(message.GET_ERROR, error)
            console.log("Db deleteProperty operation error: ", error)
            throw error
        }
    },

    /**
    * @description Function to get all property type from the property_type_master table
    * @param  {}
    */
    GetPropertyType: async function () {
        try {
            var queryObject = DBQuery.GetPropertyType()
            var result = await pool.query(queryObject)
            if (result.rowCount === 0) {
                return { success: false, message: message.GET_ERROR }
            }
            else {
                return { success: true, data: result.rows }
            }
        }
        catch (error) {
            //logger.error(message.GET_ERROR, error)
            console.log("Db getProperty Type operation error: ", error)
            throw error
        }
    },

    /**
     * @description Function to get all property options from the database
     * @param  {} req
     */
    GetPropertyOptions: async function (req) {
        try {
            var queryObject = DBQuery.GetPropertyOptions(req)
            var result = await pool.query(queryObject)
            if (result.rowCount === 0) {
                return { success: false, message: message.GET_ERROR }
            }
            else {
                console.log('When getProperty operation :', result.rows[0])
                return { success: true, data: result.rows[0] }
            }
        }
        catch (error) {
            //logger.error(message.GET_ERROR, error)
            console.log("Error in getting product details ", error)
            throw error
        }
    },



}

//------------------------------- Private Functions -------------------------------

async function AddPropertyType(req) {
    try {
        let query = DBQuery.AddPropertyType(req)
        var result = await pool.query(query)
        if (result.rowCount === 0) {
            return { success: false, message: message.INSERT_ERROR }
        } else {
            return { success: true, data: result.rows[0] }
        }
    } catch (error) {
        console.log('Error in inserting property type :', error)
        throw error



    }
}


async function DeletePropertyType(userData) {
    try {
        var query = DBQuery.DeletePropertyType(userData)
        var result = await pool.query(query)
        if (result.rowCount === 0) { return { success: true } }
        else { return { success: false } }
    } catch (error) {
        console.log('Error in forming delete query for Property Type :', error)
        return
    }
}
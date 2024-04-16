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
 * 1. addproperty {POST}        - To add new product
 * 2. getproperty {GET}         - To get all product details of inventory
 * 3. updateproduct             - To update product details 
 * 4. deleteproduct             - To delete product
 * 5. editProperty {GET}        - To show edit property screen
 * 6. getPropertyType {GET}     - To get all property types from property_type_master table
 * -----------------------------------------------------------------------------------
 * 
 * Revision History
 * -----------------------------------------------------------------------------------
 * Modified By               Modified On         Description
 * Abhinandan Kumar          19 Jan 2024         Initially Created & added routes
 * -----------------------------------------------------------------------------------
 */
const express = require('express');
const FileEditorService = require('../../service/fileeditor/FileEditorService')
const path = require('path')
const router = express.Router();
const settings = require('../../config/appConfig');
const message = require('../../message/message')
const { authorize } = require('../../middleware/authorizeMiddleware')



/**
 * @description To show data on home screen
 * @param  {} req
 * @param  {} response
 * @param  {} authorize
 */
router.get('/getproperty/:user_id', authorize, async (req, res) => {
    //if data packet is empty
    const {user_id} = req.params
    if (!user_id) {
        return res.status(403).json({ success: false, message: message.REQUEST_DATA_NOT_FOUND });
    }
    try {
        var result = await FileEditorService.GetProperty(user_id);
        if (result.success) {
            res.status(200).json({ success: true, data: result.data });
        } else {
            return res.redirect(301, '/jsonfileeditor/home');
        }
    } catch (error) {
        console.log("Error in connecting with the database ", error);
        res.status(500).json({ success: false, message: message.GET_ERROR });
    }
});

/**
 * @description To show edit property screen
 * @param  {} req
 * @param  {} response
 * @param  {} authorize
 */
router.get('/editproperty',authorize,(req,res)=>{
    res.sendFile(path.join(__dirname, '../../views/editProperty.html'))
})


/**
 * @description To update property in property_master table
 * @param  {} req
 * @param  {} response
 * @param  {} authorize
 */
router.post('/updateproperty', authorize, async (req, res) => {
    //if data packet is empty
    if (!req.body) {
        return res.status(403).json({ success: false, message: message.REQUEST_DATA_NOT_FOUND });
    }
    try {
        var result = await FileEditorService.UpdateProperty(req.body);
        if (result.success) {
            res.status(200).json({ success: true, data: result.data });
        } else {
            res.status(500).json({ success: false, message: message.UPDATE_FAILED });;
        }
    } catch (error) {
        console.log("Error in connecting with the database ", error);
        res.status(500).json({ success: false, message: message.GET_ERROR });
    }
});

/**
 * @description To add new property in the property_master table
 * @param  {} req
 * @param  {} response
 * @param  {} authorize
 */
router.post('/addproperty', authorize, async (req, res) => {
    //if data packet is empty
    if (!req.body) {
        return res.status(403).json({ success: false, message: message.REQUEST_DATA_NOT_FOUND });
    }
    try {
        var result = await FileEditorService.AddProperty(req.body);
        if (result.success) {
            res.status(200).json({ success: true, data: result.data });
        } else {
            res.status(500).json({ success: false, message: message.ADD_PROPERTY_FAILED });;
        }
    } catch (error) {
        console.log("Error in connecting with the database ", error);
        res.status(500).json({ success: false, message: message.GET_ERROR });
    }
});

/**
 * @description To delete property in the property_master table
 * @param  {} req
 * @param  {} response
 * @param  {} authorize
 */
router.post('/deleteproperty', authorize, async (req, res) => {
    //if data packet is empty
    if (!req.body) {
        return res.status(403).json({ success: false, message: message.REQUEST_DATA_NOT_FOUND });
    }
    try {
        var result = await FileEditorService.DeleteProperty(req.body);
        if (result.success) {
            res.status(200).json({ success: true, data: result.data });
        } else {
            res.status(500).json({ success: false, message: message.ADD_PROPERTY_FAILED });;
        }
    } catch (error) {
        console.log("Error in connecting with the database ", error);
        res.status(500).json({ success: false, message: message.GET_ERROR });
    }
});


/**
 * @description To get all property type from  property_type_master table
 * @param  {} req
 * @param  {} response
 * @param  {} authorize
 */
router.get('/getpropertytype', authorize, async (req, res) => {
    try {
        var result = await FileEditorService.GetPropertyType();
        if (result.success) {
            res.status(200).json({ success: true, data: result.data });
        } else {
            res.status(500).json({ success: false, message: message.GET_PROPERTY_TYPES_FAILED });;
        }
    } catch (error) {
        console.log("Error in connecting with the database ", error);
        res.status(500).json({ success: false, message: message.GET_ERROR });
    }
});


/**
 * @description To get property option from the database
 * @param  {} req
 * @param  {} response
 * @param  {} authorize
 */
router.post('/getpropertyoptions/:property_name', authorize, async (req, res) => {
    const {property_name} = req.params
    if (!property_name) {
        return res.status(403).json({ success: false, message: message.REQUEST_DATA_NOT_FOUND });
    }
    try {
        var result = await FileEditorService.GetPropertyOptions(property_name);
        if (result.success) {
            res.status(200).json({ success: true, data: result.data });
        } else {
            return res.redirect(301, 'http://localhost:3000/jsonfileeditor/home');
        }
    } catch (error) {
        console.log("Error in connecting with the database ", error);
        res.status(500).json({ success: false, message: message.GET_ERROR });
    }
});




module.exports = router
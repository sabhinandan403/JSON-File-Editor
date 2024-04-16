/**
 * Project Name : Inventory Management System
 * @company YMSLI
 * @author  Abhinandan Kumar
 * @date    Jan 19th, 2024
 * Copyright (c) 2024, Yamaha Motor Solutions (INDIA) Pvt Ltd.
 * 
 * Module : IndexRouter
 * Description
 * ----------------------------------------------------------------------------------- 
 * Module Containing all routes containing APIs of InventoryManagementServer
 * 
 * -----------------------------------------------------------------------------------
 * 
 * Revision History
 * -----------------------------------------------------------------------------------
 * Modified By             Modified On          Description
 * Abhinandan Kumar        19 Jan 2024          Initially Created
 * -----------------------------------------------------------------------------------
 */
// Module Dependencies
var Express = require("express")
var router = Express.Router()
var loginRouter = require('./login/LoginRouter')
var jsonFileEditorRouter = require('./fileeditor/FileEditorRouter')


router.use('/',loginRouter)
router.use('/jsonfileeditor',jsonFileEditorRouter)


module.exports = router
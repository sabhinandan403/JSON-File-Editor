/**
 * Project Name : Material Information
 * @company YMSLI
 * @author  Abhinandan Kumar
 * @date    January 19,2024
 * Copyright (c) 2024, Yamaha Motor Solutions (INDIA) Pvt Ltd.
 *
 * Module : DBConnector
 * Description
 * -----------------------------------------------------------------------------------
 * Used for all DB operations
 * -----------------------------------------------------------------------------------
 *
 * Revision History
 * -----------------------------------------------------------------------------------
 * Modified By          Modified On         Description
 * Abhinandan Kumar     19 Jan 2024         Initially created and added custom queries
 * -----------------------------------------------------------------------------------
 */


// Module dependencies
const { Pool } = require('pg');
const settings = require('../config/appConfig');

const message = require('../message/message'); 

let pool
try {
  // Create a new Pool instance with database connection details
  pool = new Pool({
    user: settings.USERNAME,
    host: settings.HOSTNAME,
    database: settings.DATABASE_NAME,
    password: settings.PASSWORD,
    port: settings.PORT_NO, 
  });

  // Listen for connection errors
  pool.on('error', (err) => {
    
    console.log()
    process.exit(-1);
  });

  
} catch (e) {
  
  console.error(message.DB_CONNECTION_ERROR, e.message);  
}

module.exports = {pool};

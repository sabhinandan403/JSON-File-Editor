const path = require('path');

module.exports = {
  // Log file naming and location
  PATH_LOG_FILE: path.join(__dirname, '..', 'Logs'),
  LOG_FILE_NAME: 'app.log',
  LOG_FILE_EXTENSION: '.log',
  LOGGER_AUDIT_FILE_NAME: 'audit.log',

  // Log rotation settings 
  DATE_PATTERN: 'YYYY-MM-DD',
  ZIPPED_ARCHIVE: false,
  LOG_FILE_MAX_SIZE: '20m',
  LOGS_DELETE_LIMIT: '7d',

  // Server configuration 
  SERVER_PORT: 3000,

  // Database configuration 
  DATABASE_TYPE: 'postgres',
  DATABASE_NAME: 'jsonFileEditor',
  USERNAME: 'postgres',
  PASSWORD: 'YAMAHA',
  PORT_NO: '5432',
  HOSTNAME: 'localhost',

  //Configuration
  SALT_ROUNDS: 10,

  //Property
  DB_SERVER: 'http:postgres-server',
  DB_PORT: 5432,
  DB_NAME: 'postgres',
  AMQP_IP: '127.0.0.1',
  ACTIVE_OUTPUT_MODULE: '{Module1}',
  NETWORK_NAME: 'default-network',
  MODE: 'Mode1',
  IS_TESTING_ENABLED: false

};

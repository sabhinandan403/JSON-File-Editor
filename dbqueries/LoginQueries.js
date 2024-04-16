/**
 * Organization : Yamaha Motor Solution (India)
 * Project Name : Inventory Management System
 * Module       : dbqueries
 * Decription   : Generic queries for user registeration
 * Created On   : January 19, 2024
 * Created By   : Abhinandan Kumar
 */


module.exports = {
    /**
     * @description Method to return query to insert user details in the database if the email is not lready exists otherwise return false
     * @param  {} req
     */
    AddUser: function (req) {
        const { email, password, username } = req;

        let sqlQuery = `
            INSERT INTO user_master (email, password,username)   
            VALUES ($1, $2,$3)
            ON CONFLICT (email)
            DO NOTHING
            RETURNING CASE WHEN user_master.email IS NULL THEN false ELSE true END AS user_added;
        `
        return {
            text: sqlQuery,
            values: [email, password, username]
        };
    },

    /**
    * @description Method to return query to verify user details while login 
    * @param  {} user_id
    */
    ValidateUser: function (req) {
        const { email } = req
        let sqlQuery = `SELECT * FROM user_master
       WHERE email = $1
       ;
       `
        return {
            text: sqlQuery,
            values: [email]
        }
    },
}
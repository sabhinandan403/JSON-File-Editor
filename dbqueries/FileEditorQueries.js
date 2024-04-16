/**
 * Organization : Yamaha Motor Solution (India)
 * Project Name : Inventory Management System
 * Module       : dbqueries
 * Decription   : Generic queries of inventory module
 * Created On   : January 19, 2024
 * Created By   : Abhinandan Kumar
 */



module.exports = {

    /**
     * @description Method to return query to get properties from database
     * @param  {} user_id
     */
    GetProperty: function (req) {
        var user_id = req
        user_id = parseInt(user_id)

        let sqlQuery = `SELECT *
        FROM property_master WHERE user_id = $1
        ;`

        return {
            text: sqlQuery,
            values: [user_id]
        };
    },

    /**
    * @description Method to return query to update property in the database
    * @param  {} user_id
    */
    UpdateProperty: function (userData) {
        var { user_id, columnname, newValue, property_type } = userData;
        user_id = parseInt(user_id);
        let sqlQuery;
        let values = [];

        if (property_type === 'ARRAY(CHECKBOXES)') {
            const newValuesArray = newValue.split(',').map(value => `'${value.trim()}'`);
            sqlQuery = `
                UPDATE property_master
                SET ${columnname} = ARRAY[${newValuesArray.join(', ')}]
                WHERE user_id = $1
                RETURNING *;`;

            values = [user_id];
        }
        else if (property_type === 'DROPDOWN') {
            sqlQuery = `
                UPDATE property_master
                SET ${columnname} = $2
                WHERE user_id = $1
                RETURNING *;`;
            newValue = `{${newValue}}`
            values = [user_id, newValue];
        }

        else {
            // For other columns
            sqlQuery = `
                UPDATE property_master
                SET ${columnname} = $2
                WHERE user_id = $1
                RETURNING *;`;

            values = [user_id, newValue];
        }

        return {
            text: sqlQuery,
            values: values
        };
    },

    /**
    * @description Method to return query to add properties in database
    * @param  {} user_id
    */
    AddProperty: function (req) {

        var { user_id, newColumnName, newColumnType, newColumnValue } = req
        user_id = parseInt(user_id)

        if (newColumnType === 'STRING'){
            newColumnType = 'VARCHAR'
        }


        let queries = [
            'BEGIN',
            `ALTER TABLE property_master ADD COLUMN IF NOT EXISTS ${newColumnName} ${newColumnType} DEFAULT null`,
            {
                text: `UPDATE property_master SET ${newColumnName} = $2 WHERE user_id = $1 RETURNING *`,
                values: [user_id, newColumnValue],
            },
            'COMMIT',
        ];

        return queries


    },

    /**
    * @description Method to return query to add properties in database
    * @param  {} user_id
    */
    DeleteProperty: function (req) {
        var { user_id, columnname } = req
        user_id = parseInt(user_id)

        let sqlQuery = `UPDATE property_master
        SET ${columnname} = NULL
        WHERE user_id = $1
        RETURNING *; 
        `

        return {
            text: sqlQuery,
            values: [user_id]
        };

    },

    /**
    * @description Method to return query to get all property type from the database
    * @param  {} 
    */
    GetPropertyType: function () {

        let sqlQuery = `SELECT DISTINCT * FROM property_type_master ORDER BY property_type_id ASC
         ; 
        `
        return {
            text: sqlQuery,
            values: []
        };
    },
    /**
    * @description Method to return query to add new property type in the database
    * @param  {} 
    */
    AddPropertyType: function (req) {
        let { user_id, newColumnName, newColumnValueType, property_options } = req
        let sqlQuery = `INSERT INTO user_property_mapping (user_id, property_name, property_type, property_options)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
         ; 
        `
        return {
            text: sqlQuery,
            values: [user_id, newColumnName, newColumnValueType, property_options]
        };
    },

    /**
    * @description Method to return query to check and get property type from the database
    * @param  {} 
    */
    GetPropertyOptions: function (req) {
        let property_name = req;
        let sqlQuery = `
        SELECT 
                property_options, property_type
                FROM 
                    user_property_mapping 
                WHERE 
                    property_name = $1;
        `;
        return {
            text: sqlQuery,
            values: [property_name]
        };
    },
    /**
    * @description Method to return query to delete  property type in the user_property_mapping table
    * @param  {} 
    */
    DeletePropertyType: function (req) {
        let { user_id, property_name } = req
        console.log(user_id, property_name)
        //property_name = property_name.toLowerCase();
        let sqlQuery = `DELETE FROM user_property_mapping WHERE user_id=$1 AND property_name = $2;
         ; 
        `
        return {
            text: sqlQuery,
            values: [user_id, property_name],
        };
    },



}
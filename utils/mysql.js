import mysql from 'mysql';
import * as dotenv from 'dotenv';
import util from 'util';

dotenv.config();

const connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
});
connection.connect((err) => {
    if (err) {
        console.log('Cant connect to mySQL.');
        throw err;
    }
});

export default {
    query(sql, args) {
        return util.promisify(connection.query).call(connection, sql, args);
    },
}

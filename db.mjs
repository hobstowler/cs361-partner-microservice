import mysql from "mysql";

export const pool = mysql.createPool(process.env.JAWSDB_URL);
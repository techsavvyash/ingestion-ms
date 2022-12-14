const {pg, Pool} = require('pg');

let pool;
const pgConfigTemp = {
    user: process.env.PG_USER || (() => {
        throw new Error('NO_DB_USER_PASSED_IN_ENV');
    })(),
    password: process.env.PG_PASSWORD || (() => {
        throw new Error('NO_DB_PWD_PASSED_IN_ENV');
    })(),
    database: process.env.PG_DB || (() => {
        throw new Error('NO_DB_PASSED_IN_ENV');
    })(),
    host: process.env.PG_HOST || 'localhost'
};

pool = new Pool(pgConfigTemp);

try {
    if (!process.env.JEST_TEST) {
        pool.query('SELECT CURRENT_TIMESTAMP as conTime').then(data => {
            console.log(`dbConfig:DB CONNECTION SUCCESSFUL: `, data.rows[0]);
        }).catch(err => {
            console.error(`dbConfig:DB Connection FAILED: `, err);
        });
    }
} catch (e) {
    console.error('dbConfig.: ', e);
    throw e;
}

module.exports = {
    query: (text, params) => pool.query(text, params),

    /**
     * IMPORTANT , IF YOU USE POOL DIRECTLY, Compuslory use this format as show below, client should be released
     *  const client = await pool.connect();
     try {
            const result =  await client.query(`SELECT 'Hello client' as client`);
            console.log('bootstrapInit.start: ',result.rows);

        } catch (e) {
            console.log('bootstrapInit.function: ', e);
        } finally {
            client.release();
        }
     */
    pool
};
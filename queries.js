const {Pool} = require('pg');

const pool = new Pool({
    user: 'edward',
    host: 'localhost',
    database: 'budget',
    port: '5432'
});



async function query(text, params){
    return await pool.query(text, params);
}

async function getClient(){
    const client = await pool.connect();
    return client;
};



module.exports = {query, getClient, pool};
const db = require('./queries.js');

async function createUsers(){
    const text = 'CREATE TABLE users (user_name varchar(32) PRIMARY KEY, password '+
                 'varchar(128) NOT NULL, balance numeric default 0, ' +
                 'available_balance numeric default 0)';
    await db.query(text, []);
}


async function createEnvelopes(){
    const text = 'CREATE TABLE envelopes (user_name varchar(32) REFERENCES users(user_name), ' +
                 'category varchar(32) , budget numeric default 0, ' +
                 'PRIMARY KEY (user_name, category))';
    await db.query(text, []);
}

async function createTransactions(){
    const text = 'CREATE TABLE transactions (num serial PRIMARY KEY, ' + 
                 'user_name varchar(32) REFERENCES users(user_name), ' +
                 'category varchar(32) NOT NULL, ' + 
                 'amount numeric default 0)';
    await db.query(text, []);
}

async function createSession(){
    let text = 'CREATE TABLE session (sid varchar, sess json NOT NULL, ' +
               'expire timestamp(6) NOT NULL, PRIMARY KEY(sid))'
    await db.query(text, []);
    text = 'CREATE INDEX ON session(expire)';
    await db.query(text, []);
}

async function createTables(){
    await createUsers();
    await Promise.all([createEnvelopes(), createTransactions()]);
    await createSession();
}

createTables().catch(error => {console.log(error);});
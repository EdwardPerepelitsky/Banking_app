const db = require('./queries');


async function createAccount(userName, password){
    const text = 'INSERT INTO users (user_name, password, balance, available_balance) ' +
                 'VALUES ($1, $2, 0, 0)';
    const params = [userName, password];
    await db.query(text, params);
}

async function getAccountInfo(userName, includePassword){
    let passwordText = '';
    if (includePassword === 1){passwordText = ',password '}
    const text = 'SELECT user_name AS "userName", balance AS "balance", ' + 
                 'available_balance AS "availableBalance" ' + passwordText +
                 'FROM users WHERE user_name = $1';
    const params = [userName];
    const res = await db.query(text, params);
    return res.rows;
};

async function getEnvelopeInfo(userName, category){
    let categoryText = '';
    if (category){categoryText = ' and category = $2'}
    const text = 'SELECT user_name AS "userName", category AS "category", budget as "budget" ' + 
                 'FROM envelopes WHERE user_name = $1' + categoryText;
    let params;
    if (category){
        params = [userName,category];
    }
    else{
        params = [userName];
    }
        
    const res = await db.query(text, params);
    return res.rows;
};

async function getTransactionInfo(userName){
const text = 'SELECT user_name as "userName",  category as "category", amount as "amount" ' +
             'FROM transactions where user_name = $1';
const params = [userName];
const res = await db.query(text,params);
return res.rows;
}

async function updateAccountInfo(userName, password, balance, availableBalance, client){
    const text = 'UPDATE users SET password = COALESCE($2, password), ' + 
                 'balance = COALESCE($3, balance), ' + 
                 'available_balance = COALESCE($4, available_balance) ' +
                 'WHERE user_name = $1';
    const params = [userName, password, balance, availableBalance];
    if (client){
        await client.query(text, params);
        return;
    }
    await db.query(text, params);
};


async function createNewEnvelope(userName, category, budget){
    const text = 'INSERT INTO envelopes (user_name, category, budget) ' +
                 'VALUES($1, $2, $3)';
    const params = [userName, category, budget];
    await db.query(text, params);
};


async function updateEnvelope(userName, category, budget, client){
    const text = 'UPDATE envelopes SET category = COALESCE($2, category), ' + 
                 'budget = COALESCE($3, budget) ' + 
                 'WHERE user_name = $1';
    const params = [userName, category, budget];
    if (client){
        await client.query(text, params);
        return;
    }
    await db.query(text, params);
};

async function createTransaction(userName, category, amount){
    const text = 'INSERT INTO transactions (user_name, category, amount) ' +
                 'VALUES($1, $2, $3)';
    const params = [userName, category, amount];
    await db.query(text, params);
};








module.exports = {createAccount, getAccountInfo, updateAccountInfo, createNewEnvelope, 
                  updateEnvelope, createTransaction,getEnvelopeInfo,getTransactionInfo}






















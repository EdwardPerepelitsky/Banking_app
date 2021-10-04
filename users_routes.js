const express = require('express');
const db = require('./queries');
const gq = require('./games_queries');
const bcrypt = require('bcrypt');



const router = express.Router();



router.post('/signup', async (req, res, next) => {
    if (req.session.userName){
        res.status(409).json({message: 'You are signed up and logged in.'});
        return;
    }
    const info = req.body;
    const userName = info['user_name'];
    const password = info.password;
    let existingInfo;
    try{
        existingInfo = await gq.getAccountInfo(userName, 0);
    } catch(error) {
        console.log(error);
        res.status(400).send();
        return;
    }
    if (existingInfo.length === 1) {
        res.status(409).json({message: 'user_name already exists. Please pick a different user_name.'});
        return;
    }
    try{
        const hashedPass = await bcrypt.hash(password, 10);
        await gq.createAccount(userName, hashedPass);
    } catch(error) {
        console.log(error);
        res.status(400).send();
        return;
    }
    res.status(201).json({'user_name': userName});
});

router.post('/login', async (req, res, next) => {
    if (req.session.userName){
        res.status(409).json({message: 'You are already logged in.'})
        return;
    }
    const data = req.body;
    const userName = data.user_name;
    const password = data.password;
    let info;
    try{
        info = await gq.getAccountInfo(userName, 1);
    } catch(error) {
        res.status(400).send();
        return;
    }
    if (info.length === 0){
        res.status(404).json({message: 'user_name not found.'})
        return;
    }
    info = info[0];
    const hashedPass = info.password;
    let comparison;
    try{
        comparison = await bcrypt.compare(password, hashedPass);
    } catch(error) {
        res.status(400).send();
        return;
    }
    if (comparison === false){
        res.status(401).json({message: 'wrong password.'});
        return;
    }
    const balance = Number(info.balance);
    const availableBalance = Number(info.availableBalance);
    req.session.balance = balance;
    req.session.availableBalance = availableBalance
    req.session.userName = userName;
    res.status(200).json({message: 'You are now logged in as ' + userName});    
});

router.get('/account', async (req, res, next) => {
    if (!req.session.userName){
        res.status(401).json({message: 'You must be logged in to view your account.'});
        return;
    };
    const userName = req.session.userName;
    const accountInfo = await gq.getAccountInfo(userName, 0);
    res.status(200).json(accountInfo[0]);
});

router.get('/envelopeinfo', async (req, res, next) => {
    if (!req.session.userName){
        res.status(401).json({message: 'You must be logged in to get envelope info.'});
        return;
    };
    const userName = req.session.userName;
    const queries = req.query;
    const category = queries.category;
    const envelopeInfo = await gq.getEnvelopeInfo(userName, category);
    res.status(200).json(envelopeInfo);
});

router.get('/transactioninfo', async (req, res, next) => {
    if (!req.session.userName){
        res.status(401).json({message: 'You must be logged in to get transaction info.'});
        return;
    };
    const userName = req.session.userName;
    const transactionInfo = await gq.getTransactionInfo(userName);
    res.status(200).json(transactionInfo);
});

router.post('/password', async (req, res, next) => {
   const credentials = req.body;
   let userName;
   if (req.session.userName){userName = req.session.userName}
   else {userName = credentials.userName;}
   const password = credentials.password;
   const newPassword = credentials.newPassword;
   let info;
    try{
        info = await gq.getAccountInfo(userName, 1);
    } catch(error) {
        res.status(400).send();
        return;
    }
    if (info.length === 0){
        res.status(404).json({message: 'user_name not found.'})
        return;
    }
    info = info[0];
    const hashedPass = info.password;
    let comparison;
    try{
        comparison = await bcrypt.compare(password, hashedPass);
    } catch(error) {
        res.status(400).send();
        return;
    }
    if (comparison === false){
        res.status(401).json({message: 'wrong password.'});
        return;
    }
    let hashedNewPass;
    try{
        hashedNewPass = await bcrypt.hash(newPassword, 10);
    } catch(error) {
        res.status(400).send();
        return;
    }
    await gq.updateAccountInfo(userName, hashedNewPass, null, null, null);
    res.status(200).json({message:'You have successfully changed your password.'});
});

router.post('/addenvelope', async (req, res, next) => {
    const userName = req.session.userName;
    if (!userName){
        res.status(401).json({message: 'You must be logged in to add an envelope.'})
        return;
    }

    const envParams = req.body;
    const category = envParams.category;
    const budget = Number(envParams.budget);

    let availableBalance = req.session.availableBalance
    if (budget > availableBalance){
        res.status(409).json({message: "You can't allocate more money than your available balance."})
        return;
    }

    availableBalance = availableBalance - budget
    

    await Promise.all([gq.createNewEnvelope(userName, category, budget), 
        gq.updateAccountInfo(userName, null, null, availableBalance, false)])

    req.session.availableBalance = availableBalance

    res.status(201).json({
        userName: userName,
        availableBalance: availableBalance
    });
});


router.post('/updateenvelope', async (req, res, next) => {
    const userName = req.session.userName;
    if (!userName){
        res.status(401).json({message: 'You must be logged in to update an envelope.'})
        return;
    }

    const envParams = req.body;
    const category = envParams.category;
    const deltaBudget = Number(envParams.deltaBudget)
    const envelopeInfo = await gq.getEnvelopeInfo(userName, category);
    let envBudget = Number(envelopeInfo[0].budget);
    let availableBalance = req.session.availableBalance;

    if (deltaBudget > availableBalance){
        res.status(409).json({message: "You can't allocate more money than your available balance."})
        return;
    }

    if (deltaBudget < - envBudget){
        res.status(409).json({message: "You can't lower envelope budget below 0."})
        return;
    }

    envBudget = envBudget + deltaBudget
    availableBalance = availableBalance - deltaBudget
    
    await Promise.all([gq.updateEnvelope(userName, category, envBudget,false), 
        gq.updateAccountInfo(userName, null, null, availableBalance, false)])

    req.session.availableBalance = availableBalance

    res.status(201).json({
        userName: userName,
        availableBalance: availableBalance,
        category: category,
        envBudget: envBudget

    });
});

router.post('/addtransaction', async (req, res, next) => {
    const userName = req.session.userName;
    if (!userName){
        res.status(401).json({message: 'You must be logged in to add a transaction.'})
        return;
    }

    const trParams = req.body;
    const category = trParams.category;
    const amount = Number(trParams.amount);

    let balance = req.session.balance;
    let availableBalance = req.session.availableBalance;

    if (category==='deposit'){
        balance = balance + amount;
        availableBalance = availableBalance + amount;
        await Promise.all([gq.createTransaction(userName, category, amount), 
            gq.updateAccountInfo(userName, null, balance, availableBalance, false)]);
        req.session.balance = balance;
        req.session.availableBalance = availableBalance;
        res.status(201).json({
            userName: userName,
            balance: balance,
            availableBalance: availableBalance
        });
        return;
    }

    const envelopeInfo = await gq.getEnvelopeInfo(userName, category);
    let envelopeBalance = Number(envelopeInfo[0].budget);
    

    if (amount > envelopeBalance){
        res.status(409).json({message: "You can't spend more money than allocated for this category."})
        return;
    }

    envelopeBalance = envelopeBalance - amount
    balance = balance - amount
    

    await Promise.all([gq.createTransaction(userName, category, amount), 
        gq.updateEnvelope(userName, category,  envelopeBalance, false),
        gq.updateAccountInfo(userName, null, balance, null, false)])

    req.session.balance = balance

    res.status(201).json({
        userName: userName,
        category: category,
        envBudget: envelopeBalance,
        balance: balance
    });
});


router.get('/logout', async (req, res, next) => {
    if (!req.session.userName){
        res.status(409).json({message: 'You are already logged out.'});
        return;
    }
    req.session.destroy(() => {res.status(200).json({message: 'You are now logged out'})});
});


module.exports = router;




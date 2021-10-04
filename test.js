const baseUrl = 'https://localhost:3000/'


const postObject = { method: 'POST',
headers: {'Content-Type': 'application/json'},
credentials: 'include' }
const getObject = { method: 'GET',
credentials: 'include' }
const putObject = { method: 'PUT',
headers: {'Content-Type': 'application/json'},
credentials: 'include'
}


async function postJSONResponse(url, postObj, data){ 
    postObj.body = JSON.stringify(data);
    let response = await fetch(url, postObj);
    return await response.json();
    }
async function getJSONResponse(url, getObj){ 
    let response = await fetch(url, getObj); 
    return await response.json();
}

async function putJSONResponse(url, putObj, data){ 
    putObj.body = JSON.stringify(data);
let response = await fetch(url, putObj); return await response.json();
}

async function userInteraction(userName, password){ 

        let url = baseUrl + 'users/signup'
        let data = {
        user_name: userName,
        password: password
        }
        
        let jsonResponse = await postJSONResponse(url, postObject, data); 
        
        console.log(jsonResponse);
        
        
        
        url = baseUrl + 'users/login'
        data = {
        user_name: userName,
        password: password
        }
        
        
        jsonResponse = await postJSONResponse(url, postObject, data); 
        
        console.log(jsonResponse);
        
        
        
        
        url = baseUrl + 'users/addtransaction'
        data = {
        category: 'deposit',
        amount: 5000
        }
        
        jsonResponse = await postJSONResponse(url, postObject, data); 
        
        console.log(jsonResponse);
        
        
        
        url = baseUrl + 'users/transactioninfo'
        
        jsonResponse = await  getJSONResponse(url, getObject); 
        
        console.log(jsonResponse);
        
        
        url = baseUrl + 'users/account'
        
        jsonResponse = await getJSONResponse(url, getObject); 
        
        console.log(jsonResponse);


        url = baseUrl + 'users/addenvelope'
        data = {
        category: 'food',
        budget: 1000
        }

        jsonResponse = await postJSONResponse(url, postObject, data); 
        
        console.log(jsonResponse);


        url = baseUrl + 'users/envelopeinfo'
        
        jsonResponse = await  getJSONResponse(url, getObject); 
        
        console.log(jsonResponse);
        
        
        url = baseUrl + 'users/account'
        
        jsonResponse = await getJSONResponse(url, getObject); 
        
        console.log(jsonResponse);


        url = baseUrl + 'users/updateenvelope'
        data = {
        category: 'food',
        deltaBudget: 250
        }

        jsonResponse = await postJSONResponse(url, postObject, data); 
        
        console.log(jsonResponse);



        url = baseUrl + 'users/envelopeinfo'
        
        jsonResponse = await  getJSONResponse(url, getObject); 
        
        console.log(jsonResponse);
        
        
        url = baseUrl + 'users/account'
        
        jsonResponse = await getJSONResponse(url, getObject); 
        
        console.log(jsonResponse);


        url = baseUrl + 'users/addtransaction'
        data = {
        category: 'food',
        amount: 500
        }
        
        jsonResponse = await postJSONResponse(url, postObject, data); 
        
        console.log(jsonResponse);


        url = baseUrl + 'users/transactioninfo'
        
        jsonResponse = await  getJSONResponse(url, getObject); 
        
        console.log(jsonResponse);


        url = baseUrl + 'users/envelopeinfo'
        
        jsonResponse = await  getJSONResponse(url, getObject); 
        
        console.log(jsonResponse);
        
        
        url = baseUrl + 'users/account'
        
        jsonResponse = await getJSONResponse(url, getObject); 
        
        console.log(jsonResponse);


        url = baseUrl + 'users/addtransaction'
        data = {
        category: 'food',
        amount: 2000
        }
        
        jsonResponse = await postJSONResponse(url, postObject, data); 
        
        console.log(jsonResponse);


        url = baseUrl + 'users/transactioninfo'
        
        jsonResponse = await  getJSONResponse(url, getObject); 
        
        console.log(jsonResponse);


        url = baseUrl + 'users/envelopeinfo'
        
        jsonResponse = await  getJSONResponse(url, getObject); 
        
        console.log(jsonResponse);
        
        
        url = baseUrl + 'users/account'
        
        jsonResponse = await getJSONResponse(url, getObject); 
        
        console.log(jsonResponse);

        
        url = baseUrl + 'users/logout'
        
        jsonResponse = await getJSONResponse(url, getObject); 
        
        console.log(jsonResponse);

}


userInteraction('Bob Jones', 'secretpwd')










    

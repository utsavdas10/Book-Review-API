const express = require('express');
const session = require('express-session');
const checkAuth = require('./middlewares/check-auth.js');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();


app.use(express.json());


app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))


app.use("/customer/login", genl_routes);


app.use("/customer/auth/*", checkAuth);


app.use("/customer", customer_routes);
app.use("/", genl_routes);


const PORT =5000;
app.listen(PORT,()=>console.log("Server is running"));

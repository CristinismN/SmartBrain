const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

const db = knex({
    client: 'pg',
    connection: {
      connectionString : process.env.DATABASE_URL, //127.0.0.1 - since we're moving the DB on Heroku, localhost will not be needed anymore
      ssl: {
        rejectUnauthorized: false
      }
      //user : 'postgres',
      //password : 'crookshanks',
      //database : 'smartbrain'
    }
  });

// console.log(db.select('*').from('users'));

const app = express();

app.use(bodyParser.json());
app.use(cors());

// const database = {
//     users: [ {
//         id: '123',
//         name: 'John',
//         email:'john@gmail.com',
//         password:'cookies',
//         entries: 0,
//         joined: new Date()
//     },

//     {
//         id: '124',
//         name: 'Sally',
//         email:'sally@gmail.com',
//         password:'bananas',
//         entries: 0,
//         joined: new Date()
//     }

//     ]
// }

app.get('/', (req, res)=> {
    res.send('success');
})

// SIGNIN
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) })

//REGISTER

app.post('/register', (req, res) => {register.handleRegister(req, res,db,bcrypt)})

//PROFILE

app.get('/profile/:id',  (req, res) => { profile.handleProfile(req, res, db)}) 
//with this ID syntax, we can enter in our browser almost anything in the ID place and we will be able to grab the id
// via req.params property


//IMAGE 
app.put('/image', (req, res) => { image.handleImage(req, res, db)})

//API CALL Clarifai

app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})

app.listen(process.env.PORT || 3001, ()=> { // this function will run right after the listen on port 3000 happens
    console.log(`app is running on port ${process.env.PORT}`);
});



// bcrypt.hash("bacon", null, null, function(err, hash) {
//     // Store hash in your password DB.
// });

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });








/* 

/-->  root route --> res = this is working
/signin route --> POST request (user info) success/fail
//why is signin POST?--> because we don't want to use query string, but we want the password in the body, ideally over https, so that it's hidden and secure
/register route --> POST request (add data to db (variable in our server, in our case) with our new user info) . will return new user object
in the homescreen --> /profile/:userid (so that each user has their own home screen) (:userid = optional parameter)
This will be a GET request --- we want to get the user info and this will return us the user
 ranking---> count of how many photos were submitted goes up; an /image endpoint ---> PUT (the user already exists and there's an update)
*/


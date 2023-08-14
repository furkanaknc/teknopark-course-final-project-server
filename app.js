require('dotenv').config()
const express = require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const path=require('path');
const cors=require('cors');
const passport = require('passport');


const app = express();

app.use(bodyParser.urlencoded({
    extended:false
}));


//middlewares
app.use(bodyParser.json());

app.use(cors());

app.use(express.static(path.join(__dirname,'public')));

app.use(passport.initialize());

require('./config/passport')(passport);

const db = require('./config/keys').mongoURI
mongoose.connect(db,{useNewUrlParser: true})
.then(() =>{
    console.log(`connected to db`)
})
.catch(err=>console.log(`server couldn't connected to db ${err}`));

 app.get('/', (req, res) => {
     return res.send("<h1>Hello World</h1>");
 });

const users = require('./routes/api/users');
app.use('/api/users',users)


const courses = require('./routes/api/courses');
app.use('/api/courses',courses)

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Server started on port ${PORT}`)
});
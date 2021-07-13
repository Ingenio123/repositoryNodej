const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const passport  = require('passport');
const session = require('express-session');
const fileupload = require('express-fileupload')
const clouddinary =  require('cloudinary').v2
const {createRoles} = require('./libs/initialSetup')
const  db = require('./connectDB')
const app = express();
const cors = require('cors');

db.conect_db();

createRoles();
require('./authGoogle');

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

// settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));


clouddinary.config({
  cloud_name: 'ingenio',
  api_key: '492153353896491',
  api_secret: 'cgRWmJWyjDxw8AXpcCNWE7e6yb0'
});


// middlewares
app.use(cors())

const whitelist = ['http://localhost:3000'];

const corsOption = {
  origin: function(origin,callback){
    if(whitelist.indexOf(origin) !== -1){
      callback(null,true);
    }else{
      callback(new Error("not allowed by cors :( "))
    }
  }
}

app.use(morgan("dev"))
app.use(express.urlencoded({extended: true}))

app.use(fileupload({
    useTempFiles : true
  }
))
app.use(express.json())
app.use(cookieParser());



app.engine('handlebars', exphbs({
  extname: 'handlebars', 
  defaultLayout: 'main', 
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir  : [
      //  path to your partials
      path.join(__dirname, 'views/partials'),
  ]
}));

app.set('view engine', 'handlebars');




// middleware passport 

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


app.get('/google',
  passport.authenticate('google', { scope: [ 'email', 'profile' ] }
));

app.get( '/google/auth',
  passport.authenticate( 'google', {
    successRedirect: '/user',
    failureRedirect: '/auth/google/failure'
  })
);
  
app.get('/user', isLoggedIn, (req, res) => {
  return res.status(200).json({
    succes:true,
    data:{
      username:req.user.displayName,
      profileImage: req.user.picture
    }
  })
});

app.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  return res.status(201).json({
    succes:true,
    message:'logout succes'
  })
});


app.get('/auth/google/failure', (req, res) => {
  res.send('Failed to authenticate..');
});
// successRedirect: '/protected',
// failureRedirect: '/auth/google/failure'

// routes
app.use(cors(corsOption),require('./routes/index'));
// static folder
app.use(express.static(path.join(__dirname, 'public')));

// const {sendCheckOut2}  = require('./ConnectDatafast')
// sendCheckOut2();

// start the server
app.listen(app.get('port'), () => {
  console.log(`server on port http://localhost:${app.get('port')}`);
});




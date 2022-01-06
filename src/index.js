const express= require('express')
const morgan= require('morgan')
//const indexRouter = require('./routes/index')
const exphbs = require('express-handlebars')
const path = require('path')
const ejs= require('ejs')
const flash = require('connect-flash')
const session = require('express-session')

const MySQLStore= require('express-mysql-session')

const {database} = require('./keys')
// para signup
const passport = require('passport')
require('./lib/passport')
//inicializaciones

const app=express()

// settings

app.set('port',process.env.PORT||'4000')
//app.set("views", path.join(__dirname, "views"));
app.set('views',__dirname+'/views')

  app.set("view engine", "ejs");
//middlewares
app.use(
  session({
    
    secret: "faztmysqlnodemysql",

    resave: false,
    
    saveUninitialized: false,
  
    store: new MySQLStore(database),
  })
);
app.use(flash())
app.use(morgan('dev'))

app.use(express.urlencoded({extended:false}))

app.use(express.json());

app.use(passport.initialize())
app.use(passport.session())
//app.use()
//routes
app.use(require('./routes'))
app.use(require('./routes/authentication'))

app.use('/links', require('./routes/links'))

//global variables


app.use((req,res,next)=>{

  app.locals.success = req.flash('success');
  app.locals.user=req.user
  next()
}) 
// public

app.use(express.static(path.join(__dirname, 'public')))
//listen

app.listen(app.get('port'),()=>{
    console.log(`escuchando en el puerto ${app.get('port')}`)
})

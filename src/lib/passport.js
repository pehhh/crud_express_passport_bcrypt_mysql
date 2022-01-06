const passport=require('passport')

const LocalStrategy =require ('passport-local').Strategy
const pool= require('../database')
const helpers= require('../lib/helpers')
passport.use('local.signin', new LocalStrategy({
    
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req,username,password,done)=>{
    console.log(req.body)
    const rows = await pool.query('select * from users where username=?',[username])
    if(rows.length>0){
        const user= rows[0]
        const validPassword= await helpers.matchPassword(password,user.password)//hay req.flahs min 3.03
        if(validPassword){
            done(null,user)
        }else{
            done(null,false)
        }
    }else{
        return done(null,false)// tambien req flahs
    }
}))
passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req,username,password,done)=>{
    
    console.log(req.body)
    const newUser={
       
        username: username,
        password: password,
        fullname: req.body.fullname
    }
    newUser.password=await helpers.encryptPassword(password)
    const result=await pool.query('insert into users set ?', [newUser] )
        console.log(result)
        
        newUser.id=result.insertId
        
        return done(null,newUser)
   
}))

passport.serializeUser((user,done)=>{
 done(null,user.id)
}) 

passport.deserializeUser( async(id,done)=>{
    const rows= await pool.query('select * from users where id=?', [id])
    done(null,rows[0])
})
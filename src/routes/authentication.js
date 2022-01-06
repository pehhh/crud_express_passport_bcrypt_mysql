const router=require('express').Router()
const pool= require('../database')
const passport= require('passport')

const {isLoggedIn, isNotLoggedIn}= require ('../lib/auth')

router.get('/signup', isNotLoggedIn, (req,res)=>{
    res.render('auth/signup')
})

router.post('/signup', passport.authenticate('local.signup',{
        //donde me envia si todo va bien
        successRedirect: '/profile',
        failureRedirect:'/signup',
        failureFlash:true

    }))
    /* pool.query('insert into users set ?', req.body, (err,result)=>{
        res.redirect('')
    }) */

router.get('/profile',isLoggedIn,(req,res)=>{

    res.render('auth/profile',{
        //le paso el usario local
        user: req.user
    })
})
router.get('/signin', (req,res)=>{
    res.render('auth/signin')
})
router.post('/signin', (req,res,next)=>{
    passport.authenticate('local.signin',{
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    })(req,res,next)
})

router.get('/logout', (req,res)=>{
    req.logOut();
    res.redirect('/signin')
})
module.exports=router

/* 
create table users(
    id int(11) not null,
    username varchar(16) not null,
    password varchar(60) not null,
    fullname varchar(100) not null
); */
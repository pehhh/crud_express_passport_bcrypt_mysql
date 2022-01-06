const router=require('express').Router()

const helpers = require('../lib/timeago')
const pool= require('../database')
const {isLoggedIn}= require ('../lib/auth')


router.get('/add', (req,res)=>{
    res.render('links/add')
})

router.post('/add' ,async (req,res)=>{
    const{title,url,description}=req.body
    const newLink ={
        title,
        url,
        description,
     
        user_id: req.user.id

    }
    //idem [title,url,description]
    // await no sigue a la siguiente instruccion hasta que termine
   await pool.query('insert into links set ?',[newLink] ,(err,result)=>{
       /* req.flash('success','link saved succesfully') */
       
       res.redirect('/links')
   })
})

// listar

router.get('/', isLoggedIn,async(req,res)=>{
   
    await pool.query('select * from links where user_id=?',[req.user.id],(err,result)=>{
        // ruta del archivo
        res.render('links/list',{
            data: result,
            helpers: helpers,
            user: req.user
        })
    })
})

router.get('/delete/:id',async(req,res)=>{
    const {id}= req.params
    await pool.query('delete from links where id=? ', id ,(err,result)=>{
        res.redirect('/links')
    })
})
router.get('/edit/:id', (req,res)=>{
     const {id}= req.params
     pool.query('select * from links where id=?', id, (err,result)=>{
        res.render('links/edit', {
            data: result[0]
     })
 })

})
router.post('/edit/:id',(req,res)=>{
    const {title,url,description}=req.body
    const{id}=req.params
    pool.query('update links set ? where id=? ',[req.body,req.params.id], (err,result)=>{
        res.redirect('/links')
    })
})
module.exports=router


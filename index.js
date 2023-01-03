// //server creation

// const { application } = require("express");

// //1 import express
const express = require('express')



//import dataservices

const dataservices =require('./services/data.service')

//import cors 
const cors = require('cors')


//import jwt
const jwt = require('jsonwebtoken')


// //2 create an application using the express

 const app = express()
 //to parse json from requst body

 app.use(express.json())

 //give command to share data via cors

app.use(cors({
  origin:['http://localhost:4200', 'http://192.168.29.22:8080']
}))



// //3 create a port number



app.listen(3000,() => {
    console.log('listening on port 3000');
 })

 //aplication specific middliewar

  const appMiddleware =(req,res,next)=>{
  console.log('application specific middileware');
  next();
 }
 app.use(appMiddleware)


 //router specific middilewar


 
 const jwtMiddleware =(req,res,next)=>{
 try{
  console.log('router specific middlieware');
  const token=req.headers['x-access-token'];
  const data=jwt.verify(token,'superkey2022')
  console.log(data);
  next();
 }
 catch{
  res.status(422).json({
    statusCode:422,
    status:false,
    message:'please login first'
  })

 }
 }

// //4 resolving hhtp request
// //get post put patch delete

// //resolving get result

// app.get('/',(req,res) => {
//   res.send('Get request')
// })
// //resolving post result

// app.post('/',(req,res) => {
//     res.send('Post request')
//   })

//   //resolving put result


//   app.put('/',(req,res) => {
//     res.send('Put request')
//   })

// //resolving patch result


// app.patch('/',(req,res) => {
//     res.send('Patch request')
//   })

// //resolving delete result

// app.delete('/',(req,res) => {
//     res.send('delete request')
//   })



//api call
//registration request

app.post('/register',(req,res)=>{
  console.log(req.body);
  dataservices.register(req.body.acno,req.body.username,req.body.pswd)
  .then(result=>{
    res.status(result.statusCode).json(result);
  })//access
})

//login request

app.post('/login',(req,res)=>{
  console.log(req.body);
   dataservices.login(req.body.acno,req.body.pswd)
  .then(result=>{
    res.status(result.statusCode).json(result)

})
})

//deposite request

app.post('/deposit',jwtMiddleware,(req,res)=>{
  console.log(req.body);
  dataservices.deposit(req.body.acno,req.body.password,req.body.amount)
  .then(result=>{
    res.status(result.statusCode).json(result);
  })
})


//delete
app.delete('/deleteAcc/:acno',(req,res)=>{
  
  dataservices.deleteAcc(req.params.acno)
   .then(result=>{
    res.status(result.statusCode).json(result);
   })
})

//withdraw request

app.post('/withdraw',jwtMiddleware,(req,res)=>{
  console.log(req.body);
  dataservices.withdraw(req.body.acno,req.body.password,req.body.amount)
  .then(result=>{
    res.status(result.statusCode).json(result);
  })
})



app.post('/transaction',(req,res)=>{
  console.log(req.body);
  dataservices.getTransaction(req.body.acno,)
  .then(result=>{
    res.status(result.statusCode).json(result);

  })

})
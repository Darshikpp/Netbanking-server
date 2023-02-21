  
  //import jwt token
const jwt=require('jsonwebtoken');


  //import db

  const db=require('./db')
  //database


  userDetails  = {
    1000:{acno:1000,username:"Amal",password:1000,balance:1000,transaction:[]},
    1001:{acno:1001,username:"Amalu",password:1001,balance:1001,transaction:[]},
    1002:{acno:1002,username:"Amala",password:1002,balance:1002,transaction:[]},
  }

   const register = (acno,username,password ) => {
  
   return db.User.findOne({acno})//asynchrouns call
   .then(user=>{
    if(user){
   
    return {
        status:'false',
        statusCode:400,
        message:'user already registered'
    }
   } 
   else{
   const newUser=new db.User({
      acno:acno,
      username:username,
      password:password,
      balance:0,
      transaction:[]

    })
    
    newUser.save();//data saved in monogodb
    return{
        status:'true',
        statusCode:200,
        message:'Registered successfully'
    }    
    }}
   )
  }


 



  const login=(acno,password)=>{
  return db.User.findOne({acno,password})//data
  .then(user=>{
    if(user){
      currentUser=user.username
      currentAcno=acno
      const token= jwt.sign({currentAcno:acno},'superkey2022')//to generate a token
      
      return {
        status:true,
        statusCode:200,
        message:'Login successfully',
        token:token,
        currentUser:currentUser,
        currentAcno:acno
       }    
      }
    else{
      return{
      status:false,
      statusCode:400,
      message:'invalid userdetails'
  } 
  }
  })
 }

  

 const deposit=(acno,pswd,amt)=>{
  var amount = parseInt(amt)
  return db.User.findOne({acno,pswd})
  .then(user=>{
    if(user){
      user.balance += amount;
      user.transaction.push({
        Type: 'Credit',
        Amount:amount
      })
      user.save();
      return {
        status:'true',
        statusCode:200,
        message:`${amount} is credited and balance is ${user.balance}`
      }    
      
    }
    else{
      return{
          status:'false',
          statusCode:400,
          message:'invalid userdetails'
        }    
      }}
     )
 }
     
      
      
   
  




 const withdraw=(acno,pswd,amt) =>{
  var amount=parseInt(amt)
  return db.User.findOne({acno,pswd})//data
  .then( user=>{
    if(user){
      if(user.balance >= amount){
      user.transaction.push({
        Type:"Debit",
        Amount:amount
      })
      user.save()
      return {
        status:'true',
        statusCode:200,
        message:`${amount} is debited and balance is ${user.balance}`
      }    
    }
    }
    else{
      return{
        status:'false',
        statusCode:400,
        message:'no balance'
      }    
    }}
   )
}
  




 const getTransaction=(acno)=>{
  return db.User.findOne({acno})//data
  .then(user=>{
    if(user){
  return {
    status:'true', 
    statusCode:200,
    transaction:user.transaction
  }
  }
  else{
    return {
         status:'false',
         statusCode:400,
          message:'user not found'
        }
     }
  }) 
 }
  //to delete an account

  const deleteAcc=(acno)=>{
    return db.User.deleteOne({acno})
    .then(user=>{
      if(user){
        return {
          status:true,
          statusCode:200,
          message:'user delete successfully'
      }
      }
      else{
        return {
          status:false,
          statusCode:400,
          message:'user not found'
      }
      }
    })
  }
 

module.exports={
  register,
  login,
  deposit,
  withdraw,
  getTransaction,
  deleteAcc
}

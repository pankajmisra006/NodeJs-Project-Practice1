require('dotenv').config()
var totalpeerId=new Object()
 
var connectioncount=0 
var id=''
 usersavailable = {}; // or var map = {};
var allroomId = []; // or var map = {};

var db = require('diskdb');
const moment=require('moment');
const express = require('express')
const app = express()
var randomize = require('randomatic');
const server = require('http').Server(app)
const io = require('socket.io')(server)
const bodyParser = require('body-parser');
const jwt=require('jsonwebtoken')
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});

app.use('/peerjs', peerServer);
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')
app.use(express.static('public'))
//normal rendering to open first page..
app.get('/page', (req, res) => {
    
    res.render(`chaticon`)
  })

  app.get('/chat', (req, res) => {
    
    res.render(`chat`)
  })
///openining page... Login//

app.get('/login',(req,res)=>{

res.render('login')
})


app.post('/loginvalidate',(req,res)=>{
  console.log(req.body.username)  
   const username=req.body.username
   const password=req.body.password
   const usertype="Admin"
   //calling diskdb to validate....//

  console.log(username)
  console.log(password)

   connectObject=connectDb()
   var userFound=connectObject.credentials.find({UserType:usertype,UserName:username,Password:password}).length;
   console.log(userFound)  

   if(userFound==1){
       //user is present... generate a web token..

       const accessToken=generateToken(username,password,usertype)
       const havemeetingIdFlag=connectObject.credentials.findOne({UserType:usertype,UserName:username,Password:password})
       console.log(havemeetingIdFlag['MeetingId'].length)
       if(havemeetingIdFlag['MeetingId'].length==7){
        
        res.json(getexistingmeetingId(havemeetingIdFlag['MeetingId']))  //if it already has meeting id
      }else{
       const meetingId=generatemeetingId() //generate id
       updatemeetingId(username,password,usertype,meetingId) //update the crendentials.json
       res.send(getmeetingDiv(meetingId))  //return the response
       
    }
     }else{ 
        //not found
       // res.setHeader('Content-Type', 'application/json');
        res.type('json')
        res.send(JSON.stringify(displayInvalidAccess()));
        //res.send(displayInvalidAccess())
     }
    
  res.render('login')
  })

//ENDS...//

app.get('/', (req, res) => {
 
  res.redirect(`/${randomize('0', 6)}`)
})

app.get('/:room', (req, res) => {  
 // allroomId.set(usersavailable,req.params.room)
  res.render('main', { roomId: req.params.room })
}) 

//ends...
//socket connection start..
io.on('connection',socket=>{
   
    // connections.push(socket)
    // id=socket.id
    // usersavailable[id]="person"+connectioncount++;
    

    socket.on('join-room', (roomId,userId) => {
       
        socket.join(roomId)
      
            console.log(userId)
            var arr= { 'roomId': roomId, 'personId':userId,'personname':'person '+connectioncount++}
            allroomId.push(arr)
            arr={} 
            console.log("allllllll id:::::")
           // console.log(removeduplicates(allroomId))
           

        //console.log(allroomId)
        //allroomId[roomId].usersavailable[userId]='person '+connectioncount++
        //console.log(allroomId)   
        //totalpeerId.set(userId,'person '+connectioncount++)
        //totalpeerId.push(userId)  
          
      
       socket.broadcast.to(roomId).emit('user-connected',userId,roomId); 
        io.to(roomId).emit('availableuserId',userId,roomId, getUserBasedOnRoomId(roomId,removeduplicates(allroomId)),"1") 
        //socket.to(roomId).emit('user-connected',userId); //to every id except the connecting one
       // to every id connected in the socket
        //socket.to(roomId).emit('getusers',totalpeerId)
        //updateusername() 
 
       // socket.broadcast.emit('total-user',totalpeerId)
     
 


        socket.on('disconnect', () => {   
          
             
            //console.log('disconnected called :: '+Object.keys(totalpeerId))
            console.log(roomId) 
            console.log(userId)
            //updateuser(roomId,userId,allroomId) 
            //console.log(Object.keys(allroomId))
            
            updateuser(roomId,userId,allroomId);
            io.to(roomId).emit('user-disconnected', userId,roomId,"","0")
           // delete allroomId[roomId].usersavailable[userId]
                   
              //delete totalpeerId[userId]  
              //console.log("users available")   
              //console.log(allroomId)    

          })   
 
  

      });  
 
})


//socket ends..,

var data = {
  UserType : "Admin",
  UserName : "Pankaj",
  Password : "welcome",
  MeetingId : "12345",
  CreatedOn : "2/2/2020",
  IsMeetingIdActive:"True",
  IsUserActive:"True"
  

 

}
//saveData(data)
// DATABASE operations starts..////
function saveData(data){

  dbconnect.credentials.save(data);

}

function updatemeetingId(username,password,usertype,meetingId){
  const time=moment().format('h:mm a')
  var query = {
    UserName : username,
    Password:password,
    UserType:usertype

  }; 
 
  var dataToBeUpdate = {
    MeetingId: meetingId,
    CreatedOn:time
  };
   
  var options = {
     multi: false,
     upsert: true
  };
   
  connectObject=connectDb()
  var updated = connectObject.credentials.update(query, dataToBeUpdate, options);
  console.log(updated)
   return updated

}

function generatemeetingId(){
return randomize('0', 7)

}
//DB Connection
function connectDb(){
  dbconnect=db.connect('Database', ['credentials']);
  return dbconnect;

}
 

// DATABASE Operation ends../////


//Generate a web-token....///
function generateToken(username,password,usertype){
  const payload={UserType:usertype,UserName:username,Password:password}
  const accessToken=jwt.sign(payload,process.env.SECRET_KEY)
return accessToken



}
//function authenticate token
// function authenticateToken(req,res,next){
// const authHeader =req.headers['authorization']
// const token=authHeader && authHeader.split(" ")[1]
// if(token==null) return res.sendStatus(401)

// jwt.verify(token,process.env.SECRET_KEY,(err,user)=>{
// if(err) return res.sendStatus(403)
// req.user=user
// next()

// })

// }


function displayInvalidAccess(){
  responseData = {
    'header': ' Invalid Access ! Not Allowed !',
    'body': '<div id="cross"></div>',
    'modalcode':'invalid'
}
return responseData
} 
 
 
function getmeetingDiv(meetingId){
  responseData = {
    'header': ' Your New Meeting ID !',
    'body': '<div id="meetingidcode">'+meetingId+'</div>',
    'modalcode':'success'
}
return responseData
}

function getexistingmeetingId(meetingId){
  responseData = {
    'header': ' Your Already Have a Meeting ID !',
    'body': '<div id="meetingidcode">'+meetingId+'</div>',
    'modalcode':'success'
}
return responseData
}



//this method removes the duplicates
function removeduplicates(allroomId){

  const filteredArr = allroomId.reduce((acc, current) => {
    const x = acc.find(item => item.personId === current.personId);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);
  console.log("::::::::: all available id")
  console.log(filteredArr)
  return filteredArr
} 
 

//this method updates the user after disconnect(returns all the remaning user of all rooms)
//called on disconnect
function updateuser(roomId,userId,allroomId){
  for(var i = 0; i < allroomId.length; i++) {
    if(allroomId[i].personId == userId) {
      allroomId.splice(i, 1);
        break;
    }
}
    console.log("new id:::::")
    console.log(allroomId) 
    return allroomId

} 

//get the user based on room Id
function getUserBasedOnRoomId(roomId,allroomId){
var alluserbasedonrommId=[]
  for(var i=0;i<allroomId.length;i++){
    if(allroomId[i].roomId==roomId){
      var arr= { 'roomId': allroomId[i].roomId, 'personId':allroomId[i].personId,'personname':allroomId[i].personname}

      alluserbasedonrommId.push(arr)
  
  
    }
    arr={}
  
    }
console.log("all id bsed on room Id::")
  console.log(alluserbasedonrommId)
  return alluserbasedonrommId;





}


server.listen(process.env.PORT||3010, ()=> {
    console.log('server started on port 3010!')
  })
 
  


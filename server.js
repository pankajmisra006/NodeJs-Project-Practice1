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
const ioServer= require('socket.io')(server)
const bodyParser = require('body-parser');
const jwt=require('jsonwebtoken')

// const { ExpressPeerServer } = require('peer');
// const peerServer = ExpressPeerServer(server, {
//   debug: true
// });
 
// app.use('/peerjs', peerServer);

const RTCMultiConnectionServer = require('rtcmulticonnection-server')


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
       console.log(accessToken)
       const havemeetingIdFlag=connectObject.credentials.findOne({UserType:usertype,UserName:username,Password:password})
       console.log(havemeetingIdFlag['MeetingId'].length)
       if(havemeetingIdFlag['MeetingId'].length==7){
        
        res.json(getexistingmeetingId(havemeetingIdFlag['MeetingId'],accessToken))  //if it already has meeting id
      }else{
       const meetingId=generatemeetingId() //generate id
       updatemeetingId(username,password,usertype,meetingId) //update the crendentials.json
       res.send(getmeetingDiv(meetingId,accessToken))  //return the response
       
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
  

  app.post('/connectToMeeting',authenticateToken,(req,res)=>{
    //console.log(req.user)  
     const meetingid=req.body.meetingid
     const meetingpassword=req.body.meetingpassword
     //res.redirect(`/${meetingid}`) check for id exist or not!
     res.json({Ishost:"true"})

 
  })

  app.post('/openMeeting',authenticateToken,(req,res)=>{
    //console.log(req.user)  
     const yourmeetingid=req.body.yourmeetingid
     const yourmeetingpassword=req.body.yourmeetingpassword
     
     
     res.json({Ishost:"true"})

 
  })

/////question......////

const parse = require('csv-parser');
const fs = require('fs');
app.get('/search/:searchword',authenticateToken,(req,res)=>{
  
var matchedwords = [];
var result={};
  console.log("search word=== " +req.params.searchword);

//search for word........


fs.createReadStream('/home/punkk/Downloads/myDoc/file.csv')
  .pipe(parse())
  .on('data', (row) => {
    console.log(row.WORDS.split(',').length);
    row.WORDS.trim().split(',').forEach(element => {
      if(element.includes(req.params.searchword)){
        matchedwords.push(element)
        

      }
    });
  })
  .on('end', () => {
   
    if(matchedwords.length!=0){
      result={matchedwords}
    }else{
      result= {errorCode:1,errorMessage:"Numbers cannot be searched in dictionary" }      
    }
    res.json(result)
  });


  })

//ENDS...//

// app.get('/', (req, res) => {
 
//   res.redirect(`/${randomize('0', 6)}`)
// }) 
  
app.get('/:room', (req, res) => {  
 //console.log("callinggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg")
 res.render('main', { roomId: req.params.room })
 //res.json({ roomId: req.params.room })
}) 
      
app.post('/verifymeetingpage',authenticateToken,(req, res) => {  
  //res.render('main', { roomId: req.params.room })
  res.json({ status:"200" })
 }) 








 ioServer.on('connection', function(socket) {
  RTCMultiConnectionServer.addSocket(socket);
});











//ends...
//socket connection start..
// io.on('connection',socket=>{
   
    

//     socket.on('join-room', (roomId,userId) => {
       
//         socket.join(roomId)
      
//             console.log(userId)
//             var arr= { 'roomId': roomId, 'personId':userId,'personname':'person '+connectioncount++}
//             //allroomId.push(arr)
//             arr={} 
//             console.log("allllllll id:::::")
//            // console.log(removeduplicates(allroomId))
           

       
//        socket.to(roomId).emit('user-connected',userId,roomId); 
//        // io.to(roomId).emit('availableuserId',userId,roomId, getUserBasedOnRoomId(roomId,removeduplicates(allroomId)),"1") 
//         //socket.to(roomId).emit('user-connected',userId); //to every id except the connecting one
//        // to every id connected in the socket
//         //socket.to(roomId).emit('getusers',totalpeerId)
//         //updateusername() 
 
//        // socket.broadcast.emit('total-user',totalpeerId)
     
 


//         socket.on('disconnect', () => {   
          
//             //  updateuser(roomId,userId,allroomId);
//            socket.to(roomId).broadcast.emit('user-disconnected', userId,roomId)
         

//           })   
 
  

//       });  
 
// })


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



function authenticateToken(req,res,next){
const authHeader =req.headers['authorization']
const token=authHeader && authHeader.split(" ")[1]
if(token==null) return res.sendStatus(401)
jwt.verify(token,process.env.SECRET_KEY,(err,username)=>{
if(err) return res.sendStatus(403)
req.user=username 
next()       
 
}) 

}


function displayInvalidAccess(){
  responseData = {
    'header': ' Invalid Access ! Not Allowed !',
    'body': '<div id="cross"></div>',
    'modalcode':'invalid'
}
return responseData
} 
 
 
function getmeetingDiv(meetingId,accessToken){
  responseData = {
    'header': ' Your New Meeting ID !',
    'meetingid':meetingId,
    'body': '<div id="meetingidcode">'+meetingId+'</div>',
    'modalcode':'success',
    'accessToken':accessToken
}
return responseData
}

function getexistingmeetingId(meetingId,accessToken){
  responseData = {
    'header': ' Your Already Have a Meeting ID !',
    'meetingid':meetingId,
    'body': '<div id="meetingidcode">'+meetingId+'</div>',
    'modalcode':'success',
    'accessToken':accessToken,
    'divrow':'<div class="col-xs-6 col-sm-3 col-md-3 col-lg-3 margin-bottom-20 joinchat"><a href="#services" class="change-section"><div class="black-bg btn-menu"><i class="fa fa-laptop"></i> <h2>Join Meeting</h2></div></a></div>',
    //'divcontent':'<section id="services-section" class="inactive"><div class="row"><div class="col-sm-12 col-md-12 col-lg-12"><div class="col-sm-6 col-md-6 col-lg-6 black-bg"><head> <meta charset="utf-8"><title>Stay Connected! Join Chat</title><link href='https://fonts.googleapis.com/css?family=Nunito:400,300' rel='stylesheet' type='text/css'></head><body><form action="index.html" method="post"> <h1>Stay Connected!</h1> <fieldset> <label for="meetingid">MeetingId:</label><input type="text" id="meetingid" name="meetingid"><label for="password">Password:</label> <input type="text" id="password" name="password"><label>Interests:</label><input type="checkbox" id="muteaudio" value="muteaudio" name="user_interest"><label class="light" for="muteaudio">Mute Audio</label><br><input type="checkbox" id="disablevideo" value="disablevideo" name="user_interest"><label class="light" for="disablevideo">Disable Video</label><br></fieldset><button id="stayconnected" type="submit">Connected!</button></form> </body></div><div class="col-xs-6 col-sm-6 col-md-6 col-lg-6  pull-right"> <a href="#menu" class="change-section"> <div class="black-bg btn-menu"> <h2>Back to menu</h2></div> </a> </div></div> </div></section>'
}
return responseData
}

//set the cookie 
function setCookie(accessToken){
  const cookieOptions = {
    httpOnly: true,
    expires: 0 
   }

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

server.listen(process.env.PORT||3000, ()=> {
    console.log('server started on port 3020!')
  })
  
  

  
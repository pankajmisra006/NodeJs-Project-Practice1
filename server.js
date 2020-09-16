
var totalpeerId=new Object()
 
var connectioncount=0
var id=''
 usersavailable = {}; // or var map = {};
var allroomId = []; // or var map = {};

const express = require('express')
const app = express()
// const cors = require('cors')
// app.use(cors())
var randomize = require('randomatic');
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});

app.use('/peerjs', peerServer);

app.set('view engine', 'ejs')
app.use(express.static('public'))
//normal rendering to open first page..
app.get('/page', (req, res) => {
    
    res.render(`chaticon`)
  })

  app.get('/chat', (req, res) => {
    
    res.render(`chat`)
  })


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
 
  


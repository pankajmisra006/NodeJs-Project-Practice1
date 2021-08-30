//const Peer = require("peerjs")


var peerAndStream=[]
let videoGrid=$('#video-grid')
var count=0
var divshow=""
var usermessagediv=new Map()
const socket = io('/')
var allusers = new Object(); // or var map = {};
var alluserspeerId = new Map()
var userIdtoList=new Object()
var loggeduserid=''
var userStream=''
var senderidtoappend=""
const peers={} //track all the peer
const myPeer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3010'             //should be on the same server as application
  })

//enabaling video here//
   
let myVideoStream;
const myVideo = document.createElement('video')
myVideo.muted = true;


navigator.mediaDevices.getUserMedia({
  audio: true,
  video: true,
    
  }).then(stream=>{
    myVideoStream=stream;

    if(localStorage.getItem('interest').split(",").length==2){
      
      
     myVideoStream.getVideoTracks()[0].enabled = false;
     setPlayVideo()
      myVideoStream.getAudioTracks()[0].enabled = true;
      setUnmuteButton()
     
    
    }
    else if(localStorage.getItem('interest').split(",").length==1){
      if(localStorage.getItem('interest').split(',')[0]=="disablevideo"){
       
     myVideoStream.getVideoTracks()[0].enabled = false;
     setPlayVideo()
    
      }else{
        myVideoStream.getAudioTracks()[0].enabled = true;
      setUnmuteButton()
     
    
      }
    
    }
    

    addVideoStream(myVideo, stream)

    myPeer.on('call', call => {    //when user calls us we answer and add it to stream
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
          addVideoStream(video, userVideoStream)
        })
      })

    socket.on('user-connected', (userId,roomId) => {
    
     connectToNewUser(userId, stream)


      })
    

  })

  




  function addVideoStream(video, stream) {
    video.srcObject = stream
    video.classList.add(stream.id)
    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
    videoGrid.append(video)
  }
 
     
  function connectToNewUser(userId,stream){
    
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')    //here in this method we will get the stream
                                                    // of another user and display
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
 })
 call.on('close',()=>{

  video.remove()
 })

 peers[userId]=call
 console.log(peers)
 }

 
   
  //video ends...  

  
  //joing the room id strarts..
  myPeer.on('open', id => { 
    //console.log('My peer ID is: ' + id);
    socket.emit('join-room', ROOM_ID, id) //here peer will also have an id different to room id
    
    
  })  
 

 
  
 function removeVideo(){
  const html = `
  <i class="fas fa-video"></i>
  <span>Stop Video</span>
`
document.querySelector('.main__video_button').innerHTML = html;

 }
  

function exhangepeerId(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play() 
  })
  videoGrid.append(video)
} 

socket.on('availableuserId', (userId,roomId,totalpeerId,status) => {

 console.log(totalpeerId)
 console.log("::MY OWN PEER ID:: "+myPeer.id)
 updateUserAvailable(myPeer.id,roomId,totalpeerId,status)
  
})   

  socket.on('user-disconnected', (userId,roomId) => {
    console.log("comingggggggggggggggggggggggggggggggggggggggggggggggg")
    if (peers[userId]) 
    peers[userId].close()
    //localStorage.clear()
    
    
  })   
  //ends... 
 
 
  const muteUnmute = () => { 
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getAudioTracks()[0].enabled = false;
      setUnmuteButton();
    } else {
      setMuteButton();
      myVideoStream.getAudioTracks()[0].enabled = true;
    }
  }
  
  const playStop = () => {
    console.log('object')
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      setPlayVideo()
    } else {
      setStopVideo()
      myVideoStream.getVideoTracks()[0].enabled = true;
    }
  }
  
  const setMuteButton = () => {
    const html = `
      <i class="fas fa-microphone"></i>
      <span>Mute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
  }
  
  const setUnmuteButton = () => {
    const html = `
      <i class="unmute fas fa-microphone-slash"></i>
      <span>Unmute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
  }
  
  const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }
  
  const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }
   




  ///Chat appliation js starts here..


  $('#frame').dblclick(function() {
    $('.Layout').removeClass('div-active')
    $(".Layout").hide();
    $(".chat_on").show(300); 
   });


  $(".chat_on").click(function(){
    $('.Layout').addClass('div-active')
    $(".Layout").toggle();
    $(".chat_on").hide(300);
    $('.badge').hide()
});


   $(".chat_close_icon").click(function(){
    $(".Layout").hide();
       $(".chat_on").show(300);
});

$("#profile-img").click(function() {
$("#status-options").toggleClass("active");
});

$(".expand-button").click(function() {
$("#profile").toggleClass("expanded");
$("#contacts").toggleClass("expanded");
});

$("#status-options ul li").click(function() {
$("#profile-img").removeClass();
$("#status-online").removeClass("active");
$("#status-away").removeClass("active");
$("#status-busy").removeClass("active");
$("#status-offline").removeClass("active");
$(this).addClass("active");

if($("#status-online").hasClass("active")) {
$("#profile-img").addClass("online");
} else if ($("#status-away").hasClass("active")) {
$("#profile-img").addClass("away");
} else if ($("#status-busy").hasClass("active")) {
$("#profile-img").addClass("busy");
} else if ($("#status-offline").hasClass("active")) {
$("#profile-img").addClass("offline");
} else {
$("#profile-img").removeClass();
};

$("#status-options").removeClass("active");
});


  //making of chat starts.......
 
  $(document).on('keyup',".message-input",function (e) {
    if (e.keyCode === 13) {
      var senderId=$(this).parent().attr('id')
      var message=$("#"+senderId).find(".message-input input").val().trim()
      if(message.length>0){
      $('.contact.active .preview').html('<span>You: </span>' + message);
      $(document).find(".messages").animate({ scrollTop: $(document).height() }, "fast");
      appendtext(senderId,message)
      }
    }   
});  
$(document).on('click','.submit',function(e){
  
  var senderId=$(this).parent().parent().parent().attr('id')
  var message=$("#"+senderId).find(".message-input input").val().trim()
  if(message.length>0){
  $('.contact.active .preview').html('<span>You: </span>' + message);
  appendtext(senderId,message)
   
  }
})  

function appendtext(senderId,message){
 // socket.emit('sendmessage', senderId, message) 
 //senderidtoappend=senderId
 //send message
 var conn = myPeer.connect(senderId);
conn.on('open', function(){
  // here you have conn.id
  conn.send(message);
});
$(document).find(".message-input input").val('')
$(document).find("#"+senderId).find('#appendmsg').append('<li class="sent"><img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" /><p>'+message+'</p></li>')

 

}
   //receive message
myPeer.on('connection', function(conn) {
  conn.on('data', function(data){
    
    $('#userdiv').children('div').each(function(){
     
      if(conn.peer==$(this).attr('id')){
        if(!$(".Layout").hasClass('div-active')){
          $(".badge").show()
        }else{
          $(".badge").hide()  
        } 
        var idd=$(this).attr('id')  
        $(document).find("#"+idd).find('#appendmsg').append(' <li class="replies"><img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" /><p>'+data+'</p> </li>')
        
        //$('#allusers li').attr('value')
       if( $('#allusers').find('.active').attr('value')==conn.peer){



       }else{
        $('#allusers li').each(function(){
         if($(this).attr('value')==idd){
          $(this).find('.newmsg').show()
          
         }
        })


       }

 


      }  
 

    })

  });
});

//////////////////////// creating avialable user list starts/////////////////////////////

function updateUserAvailable(userOwnId,roomId,totalpeerId,status){
  var allid=[]
  var avaliableLi=[]
  var arr={}
  if(ROOM_ID==roomId){  //check if roomid is available
    if(status=="1"){
    allid=deleteownpeerId(userOwnId,roomId,totalpeerId)
   console.log(allid.length) 

    if($('ul#allusers li').length>=1){
      $('#allusers li').each(function(){
        arr={'personId':$(this).attr('value')}
        avaliableLi.push(arr)
      })   
      console.log(allid.length) 

      console.log(avaliableLi.length) 

var res = allid.filter(item1 => !avaliableLi.some(item2 => (item2.personId === item1.personId)))
console.log(res[0])
$('#allusers').append('<li class="contact" value='+res[0].personId+'><div class="wrap"><span class="contact-status online"></span><img src="http://emilcarlsson.se/assets/louislitt.png" alt="" /><div class="meta"><p class="name">'+res[0].personname+'</p> <i class="fa fa-envelope newmsg" style="font-size:18px;color:tomato;display:none;"></i><p class="preview"></p> </div></div></li>')
$("#userdiv").append('<div id= '+res[0].personId+' style="display:none;"> <div class="contact-profile "  ><img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" /><p>'+res[0].personname+'</p></div><div class="messages" ><ul id="appendmsg"></ul></div><div class="message-input "><div class="wrap"><input type="text" placeholder="Write your message..." autofocus/><button class="submit"><i class="fa fa-paper-plane" aria-hidden="true"></i></button></div></div></div>')
$("#total-users-online").text($('ul#allusers li').length)
       


    }else{
 
      for(var i=0;i<allid.length;i++){
        $('#allusers').append('<li class="contact" value='+allid[i].personId+'><div class="wrap"><span class="contact-status online"></span><img src="http://emilcarlsson.se/assets/louislitt.png" alt="" /><div class="meta"><p class="name">'+allid[i].personname+'</p><i class="fa fa-envelope newmsg" style="font-size:18px;color:tomato  ;display:none;"></i> <p class="preview"></p> </div></div></li>')
        $("#userdiv").append('<div id= '+allid[i].personId+' style="display:none;"> <div class="contact-profile "  ><img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" /><p>'+allid[i].personname+'</p></div><div class="messages" ><ul id="appendmsg"></ul></div><div class="message-input "><div class="wrap"><input type="text" placeholder="Write your message..." autofocus /><button class="submit"><i class="fa fa-paper-plane" aria-hidden="true"></i></button></div></div></div>')

      }
      $("#total-users-online").text($('ul#allusers li').length)
 
    }  
 
  }else{
        if(status=="0"){    //disconnecting the user

                  //removing from the div
                $('#allusers li').each(function(){
                  if($(this).attr('value')==userOwnId){
                   $(this).remove() 
                   $('#userdiv').find("#"+userOwnId).remove() 

             
                  }    
                })  
                $("#total-users-online").text($('ul#allusers li').length)

        }


  }
  
  } else{  

    console.log("room Id not avilable!!")


  }
 
//////////on clicking li/////// starts///////////
$('#allusers li').on('click',function(e){
  
  $(this).find('.newmsg').hide()
  if($(this).hasClass('active')){
    $('#allusers li').removeClass('active')
    $(this).addClass('active')
   }else{
    $('#allusers li').removeClass('active')
     $(this).addClass('active') 
   } 

   $('#userdiv').children('div').each(function(){

    $(this).css("display","none")
    

   })
  var clickedLi=$(this).attr('value')

   $('#userdiv').children('div').each(function(){
    //console.log($(this).attr('id'))
    if(clickedLi==$(this).attr('id')){
      var cl=clickedLi
      $('#userdiv').find('#'+cl).show()
      //$(document).find('#userdiv div').not(":eq("+val+")").hide();

      

    } 


  })


  })



//ends///////////


}
function deleteownpeerId(userOwnId,roomId,totalpeerId){
  for(var i = 0; i < totalpeerId.length; i++) {
    if(totalpeerId[i].personId == userOwnId) {
      totalpeerId.splice(i, 1);
        break;
    }
}
    console.log("available user:::::")
    console.log(totalpeerId) 
    return totalpeerId

}  

 

 


/////////////////////////////////////////////Ends//////////////////////////////////////

//group chat starts//

$('#groupchat-img').on('click',function(e){
 
  alert("coming")

})


//ends//



  //ends.......

/// login starts...//

$("#submitBtn").click(function(){

  alert("coming")
})



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
var mypeerId=[] //get  my own peer id
var senderidtoappend=""
const myPeer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '443'             //should be on the same server as application
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
    addVideoStream(myVideo, stream)
    myPeer.on('call', call => {    //when user calls us we answer and add it to stream
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
          addVideoStream(video, userVideoStream)
        })
      })

    socket.on('user-connected', (userId,roomId) => {
      loggeduserid=userId
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
    //console.log(call) 
   // addVideoandId(userId,stream)

    const video = document.createElement('video')    //here in this method we will get the stream
                                                    // of another user and display
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
 })
 }
// function addVideoandId(userId,stream){
//   arr={}
//   var arr={"personId":userId,"streamId":stream.id}
//   peerAndStream.push(arr)
//   console.log(peerAndStream)
// }
 
   
  //video ends...  

  
  //joing the room id strarts..
  myPeer.on('open', id => { 
    //console.log('My peer ID is: ' + id);
    socket.emit('join-room', ROOM_ID, id) //here peer will also have an id different to room id
    
    
  })  
 

 
  function removetheUserVideo(myVideoStream){
    //removeVideo()
    myVideoStream.getVideoTracks()[0].enabled = false;
 
 } 
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

  socket.on('user-disconnected', (userId,roomId,remainingId,status) => {
    if (myPeer[userId]) 
    myPeer[userId].close()
    
    updateUserAvailable(userId,roomId,remainingId,status) 
    
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

// function newMessage() {
// message = $(".message-input input").val();
// if($.trim(message) == '') {
// return false;
// }
// $('<li class="sent"><img src="http://emilcarlsson.se/assets/mikeross.png" alt="" /><p>' + message + '</p></li>').appendTo($('.messages ul'));
// $('.message-input input').val(null);
// $('.contact.active .preview').html('<span>You: </span>' + message);
// $(".messages").animate({ scrollTop: $(document).height() }, "fast");
// };

// $('.submit').click(function() {
// newMessage();
// });

// $(window).on('keydown', function(e) {
// if (e.which == 13) {
// newMessage();
// return false;
// } 
// });
 
  //ends...

//   function updateAvailableuser(userId,totalpeerId){
//     var usercount=0
//     var jsonData=JSON.stringify(totalpeerId)
//     console.log("allusers::: "+jsonData) 
//     console.log("whos id "+myPeer.id)
    
//     var diff=new Object()
//     diff = Object.keys(totalpeerId).reduce((diff, key) => {
//       if (myPeer.id === key) return diff
//       return {
//         ...diff,
//         [key]: totalpeerId[key]
//       }
//     }, {})  
    
//     console.log(diff)  
//   //$(document).find('#userdiv').show()

//   //$("#userdiv").empty() 
//   //$("#allusers li").remove() 
//   var avaliableLi=[]  
//   if(Object.keys(diff).length!=0){
  
//     if($('ul#allusers li').length>=1){
 
//       $('#allusers li').each(function(){
//         console.log("d,ada,"+$(this).attr('value'))
//         avaliableLi.push($(this).attr('value'))
//       }) 
//       if(Object.keys(diff).length>avaliableLi.length){
         
//                 var litoadd=new Object();
         
//                 litoadd = Object.keys(diff).reduce((litoadd, key) => {
//                 for(var j=0;j<avaliableLi.length;j++){
//                 if (avaliableLi[j]=== key) return litoadd}
//                 return {
//                   ...litoadd,   
//                    [key]: diff[key]
//                 } 
//               }, {})
                
             
//             console.log(litoadd) 

//       for(i=0;i<Object.keys(litoadd).length;i++){ 
//         var id=Object.keys(litoadd)[i]
//         var name=Object.values(litoadd)[i]

//       $('#allusers').append('<li class="contact" value='+id+'><div class="wrap"><span class="contact-status online"><span class="badge">1</span></span><img src="http://emilcarlsson.se/assets/louislitt.png" alt="" /><div class="meta"><p class="name">'+name+'</p> <p class="preview">You just got LITT up, Mike.</p> </div></div></li>')
//       $("#total-users-online").text($('ul#allusers li').length)
//       //$("#userdiv").append('<div class= "example '+id+' "style="display:none;"> <div class="contact-profile '+id+'" style="display:none;" ><img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" /><p>'+name+'</p></div><div class="messages '+id+'" style="display:none;" ><ul id="appendmsg"></ul></div><div class="message-input '+id+' "style="display:none;"><div class="wrap"><input type="text" placeholder="Write your message..." /><button class="submit"><i class="fa fa-paper-plane" aria-hidden="true"></i></button></div></div></div>')
//       $("#userdiv").append('<div id= '+id+' style="display:none;"> <div class="contact-profile " ><img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" /><p>'+name+'</p></div><div class="messages" ><ul id="appendmsg"></ul></div><div class="message-input "><div class="wrap"><input type="text" placeholder="Write your message..." /><button class="submit"><i class="fa fa-paper-plane" aria-hidden="true"></i></button></div></div></div>')


   
//       }
 
//       }else{ 
//           //user is  disconnected
//                 var result = '';
//                 var keys = Object.keys(diff);

//                 for(var j=0;j<avaliableLi.length;j++){

//                 if (!keys.includes(avaliableLi[j])) {
                  
//                 console.log(":::::::::::;to be deleted from li;"+avaliableLi[j]);
//                 result=avaliableLi[j]
//                 }
//                 } 

//                 //removing from the div
//                 $('#allusers li').each(function(){
//                   if($(this).attr('value')==result){
//                    $(this).remove() 
//                    $('#userdiv').find("#"+result).remove() 

            
//                   }   
//                 })  
//                 $("#total-users-online").text($('ul#allusers li').length)

//       }  
 
    
         
 
//     }else{
//       for(i=0;i<Object.keys(diff).length;i++){
//         //var result=jsonData.split(',')[2].split(':')[1].replace(/['"]+/g, '').replace(/[{}]+/g, '')
//         var id=Object.keys(diff)[i]
//         var name=Object.values(diff)[i]
 
//       $('#allusers').append('<li class="contact" value='+id+'><div class="wrap"><span class="contact-status online"><span class="badge">1</span></span><img src="http://emilcarlsson.se/assets/louislitt.png" alt="" /><div class="meta"><p class="name">'+name+'</p><p class="notification"></p> <p class="preview">You just got LITT up, Mike.</p> </div></div></li>')
//      $("#userdiv").append('<div id= '+id+' style="display:none;"> <div class="contact-profile "  ><img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" /><p>'+name+'</p></div><div class="messages" ><ul id="appendmsg"></ul></div><div class="message-input "><div class="wrap"><input type="text" placeholder="Write your message..." /><button class="submit"><i class="fa fa-paper-plane" aria-hidden="true"></i></button></div></div></div>')
//      $("#total-users-online").text($('ul#allusers li').length)

 
//       }

//     }    

     
//   //} 
// }else{ 
//     $('#allusers li').each(function(){
//       console.log("d,ada,"+$(this).attr('value'))
//       if($(this).attr('value')==userId){
//        $(this).remove()
//        $('#userdiv').find("#"+userId).remove() 

//       }   
//     }) 
//     $("#total-users-online").text($('ul#allusers li').length)




// }
    


  



//   }
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


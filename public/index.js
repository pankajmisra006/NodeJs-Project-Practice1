// let _videoGrid=$('#video-grid')
// const _myVideo = document.createElement('video')
// _myVideo.muted = true;
let _myVideoStream;
var connection = new RTCMultiConnection();
connection.socketURL = '/';
//connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';



connection.socketMessageEvent = 'room-id';

connection.session = {
    audio: true,
    video: true
};

connection.sdpConstraints.mandatory = {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: true
};


var bitrates = 512;
var resolutions = 'Ultra-HD';
var videoConstraints = {};

if (resolutions == 'HD') {
    videoConstraints = {
        width: {
            ideal: 1280
        },
        height: {
            ideal: 720
        },
        frameRate: 30
    };
}

if (resolutions == 'Ultra-HD') {
    videoConstraints = {
        width: {
            ideal: 1920
        },
        height: {
            ideal: 1080
        },
        frameRate: 30
    };
}
connection.mediaConstraints = {
  video: videoConstraints,
  audio: true
};

var CodecsHandler = connection.CodecsHandler;

connection.processSdp = function(sdp) {
    var codecs = 'vp8';
    
    if (codecs.length) {
        sdp = CodecsHandler.preferCodec(sdp, codecs.toLowerCase());
    }

    if (resolutions == 'HD') {
        sdp = CodecsHandler.setApplicationSpecificBandwidth(sdp, {
            audio: 128,
            video: bitrates,
            screen: bitrates
        });

        sdp = CodecsHandler.setVideoBitrates(sdp, {
            min: bitrates * 8 * 1024,
            max: bitrates * 8 * 1024,
        });
    }

    if (resolutions == 'Ultra-HD') {
        sdp = CodecsHandler.setApplicationSpecificBandwidth(sdp, {
            audio: 128,
            video: bitrates,
            screen: bitrates
        });

        sdp = CodecsHandler.setVideoBitrates(sdp, {
            min: bitrates * 8 * 1024,
            max: bitrates * 8 * 1024,
        });
    }

    return sdp;
};

// use your own TURN-server here!
connection.iceServers = [{
  'urls': [
      'stun:stun.l.google.com:19302',
      'stun:stun1.l.google.com:19302',
      'stun:stun2.l.google.com:19302',
      'stun:stun.l.google.com:19302?transport=udp',
  ]
}];

connection.videosContainer = document.getElementById('video-grid');
connection.onstream = function(event) {
  var existing = document.getElementById(event.streamid);
    if(existing && existing.parentNode) {
      existing.parentNode.removeChild(existing);
    }
    _myVideoStream=event.stream
    event.mediaElement.removeAttribute('src');
    event.mediaElement.removeAttribute('srcObject');
    event.mediaElement.muted = true;
    event.mediaElement.volume = 0;

    var video = document.createElement('video');

    try {
        video.setAttributeNode(document.createAttribute('autoplay'));
        video.setAttributeNode(document.createAttribute('playsinline'));
    } catch (e) {
        video.setAttribute('autoplay', true);
        video.setAttribute('playsinline', true);
    }


    if(event.type === 'local') {
      video.volume = 0;
      try {
          video.setAttributeNode(document.createAttribute('muted'));
      } catch (e) {
          video.setAttribute('muted', true);
      }
    }
    video.srcObject = event.stream;

    var width = parseInt(connection.videosContainer.clientWidth / 3) - 20;
    var mediaElement = getHTMLMediaElement(video, {
     // title: localStorage.getItem('loggeduser'),
        width: width,
        showOnMouseEnter:false
        //buttons: ['mute-audio']
    });

    connection.videosContainer.appendChild(mediaElement);

    setTimeout(function() {
        mediaElement.media.play();
    }, 5000);

    mediaElement.id = event.streamid;

    // to keep room-id in cacheconnectToNewUser
    localStorage.setItem(connection.socketMessageEvent, connection.sessionid);

    chkRecordConference.parentNode.style.display = 'none';

    

    if(event.type === 'local') {
      connection.socket.on('disconnect', function() {
        if(!connection.getAllParticipants().length) {
          location.reload();
        }
      });
    }
  


}

connection.onstreamended = function(event) {
  var mediaElement = document.getElementById(event.streamid);
  if (mediaElement) {
      mediaElement.parentNode.removeChild(mediaElement);
  }
};



if(localStorage.getItem('minfo')==1001){

  openMeetingConnection()
}
else if(localStorage.getItem('minfo')==1000){

  joinMeetingConnection()
}


// detect 2G
if(navigator.connection &&
  navigator.connection.type === 'cellular' &&
  navigator.connection.downlinkMax <= 0.115) {
 alert('2G is not supported. Please use a better internet service.');
}


//////////function starts....................................///

function openMeetingConnection(){

  connection.open(ROOM_ID, function(isRoomOpened, roomid, error) {
    if(isRoomOpened === true) {
    }
    else {
      if(error === 'Room not available') {
        alert('Someone already created this room. Please either join or create a separate room.');
        return;
      }
      alert(error);
    }
});




}

function joinMeetingConnection(){

  connection.checkPresence(ROOM_ID, function(isRoomExist, roomid) {
    if (isRoomExist === true) {
        connection.join(roomid);
    } else {
      alert('let the host start the meeting');

        //connection.open(roomid);
    }
});


}


function addVideoStream(video, stream,streamid) {
  video.srcObject = stream
  video.setAttribute("id", streamid);
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  _videoGrid.append(video)
}


// function setInterest(myVideo_Audio_Stream) {

//   if(localStorage.getItem('interest').split(",").length==2){
    
    
//     myVideo_Audio_Stream.getVideoTracks()[0].enabled = false;
//     setPlayVideo()
//     myVideo_Audio_Stream.getAudioTracks()[0].enabled = true;
//      setUnmuteButton()
    
   
//    }
//    else if(localStorage.getItem('interest').split(",").length==1){
//      if(localStorage.getItem('interest').split(',')[0]=="disablevideo"){
      
//       myVideo_Audio_Stream.getVideoTracks()[0].enabled = false;
//     setPlayVideo()
   
//      }else{
//       myVideo_Audio_Stream.getAudioTracks()[0].enabled = true;
//      setUnmuteButton()
    
   
//      }
   
//    }


// }


const muteUnmute = () => { 
  const enabled = _myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    _myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    _myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

const playStop = () => {
  console.log('object')
  let enabled = _myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    _myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo()
  } else {
  
    _myVideoStream.getVideoTracks()[0].enabled = true;
    setStopVideo()
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
 


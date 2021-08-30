(function ($) {
const accessToken=""

    "use strict";


    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit',function(){
        var check = true;
        console.log("comingggggggggg")

        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            }
        }

        return check;
    });


    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    function validate (input) {
        if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        else {
            if($(input).val().trim() == ''){
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }
    
    /*==================================================================
    [ Show pass ]*/
    var showPass = 0;
    $('.btn-show-pass').on('click', function(){
        if(showPass == 0) {
            $(this).next('input').attr('type','text');
            $(this).find('i').removeClass('fa-eye');
            $(this).find('i').addClass('fa-eye-slash');
            showPass = 1;
        }
        else {
            $(this).next('input').attr('type','password');
            $(this).find('i').removeClass('fa-eye-slash');
            $(this).find('i').addClass('fa-eye');
            showPass = 0;
        }
        
    });
    

//registration starts....





//ends............s
//logout starts..



$(".logout").click(function(){

displaylogout()
})


/// login starts...//
if(localStorage.getItem('loggeduser')!=null){

    $('.welcome').text(localStorage.getItem('loggeduser'))
}
$("#submitBtn").click(function(){
    var username=$("#username").val().trim()
    var password=$("#password").val().trim()
    
    if(username.length>0 && password.length>0){
    var response=postAjax("loginvalidate",{'username':username,'password':password})

     if(response['modalcode']=='success'){
     localStorage.setItem('auth', response['accessToken']);
     localStorage.setItem('loggeduser', username);
     
     displaynormal('submitBtn',response)
     //displayadditionaldiv(response)
     $(".welcome").text("")
    $(".welcome").text(username)
    $(".welcome").show()
    $('#yourmeetingid').val(response['meetingid'])

      }else{
        displayerror('submitBtn',response)

      }

    }else{
      alert("Please enter username/password !")

    }
    return false;
})

///display modal..

function displaynormal(id,response){
    $('.modal-title').html(response["header"]);
      $('.modal-body').html(response["body"]);
      $('.modal-dialog').css('width','400px');
     // $("#"+id).attr("data-toggle", "modal");
     $('#myModal').removeClass('fade')
     $('#myModal').addClass('show')     //$('#myModal').modal('hide');
   
    }

// display error..

function displayerror(id,response){
    $('.modal-title').html(response["header"]);
      $('.modal-body').html(response["body"]);
      $('.modal-dialog').css('width','');
      $('.modal-dialog').css('width','400px');
      $('#myModal').removeClass('fade')
      $('#myModal').addClass('show')
     // $("#"+id).attr("data-toggle", "modal");
   
   
    }

    function displayadditionaldiv(response){
        $('.secondrow').append(response['divrow'])
      

    }
function displaylogout(){
    $('.modal-title').html('Are you sure you want to logout!');
    $('.modal-body').html('<div id="logoutemoji"><i class="far fa-sad-tear"></i></div>');
    $('.modal-dialog').css('width','');
    $('.modal-dialog').css('width','400px');
    $('#myModal').removeClass('fade')
    $('#myModal').addClass('show')

}
///refresh modal.....

// function refreshmodal(id){
//     $("#"+id).attr("data-toggle", "");
//       $('.okbutton').attr('id','')
  
//    }





$(".okbutton,.close").click(function(){
    $('#myModal').removeClass('show')
    $('#myModal').addClass('fade')

})

//JOIN CHAT SECTION STARTS..........
$("input[type=checkbox]").change( function() {

    var selectedarray=[]
$("[type=checkbox]:checked").each ( function() {
 if($(this).val()!='on'){

     selectedarray.push($(this).val());

    }


});
localStorage.setItem("interest",selectedarray)
console.log(selectedarray)
})


$("#stayconnected").click(function(){
  

    var meetingid=$("#meetingid").val().trim()
    var meetingpassword=$("#meetingpassword").val().trim()
    if(meetingid.length>0 && meetingpassword.length>0){
        var response=postAjaxToken("connectToMeeting",{'meetingid':meetingid,'meetingpassword':meetingpassword,'accessToken':localStorage.getItem('auth')})
        //console.log(response)

        if(response.status==403 || response.status==401){
            alert("Please login! with valid credentials!")
        }else{
            localStorage.setItem("host",response.Ishost)
            localStorage.setItem("minfo",1000)
            var url = ('http://localhost:3010'+`/${meetingid}`);
           // window.open(url,'_blank',"windowopen");
            openOnce(url, 'windowopen');
            //window.close()
           
           
                //   if (window.IsDuplicate()) {
                //     alert("This is duplicate window\n\n Closing...");
                //     //window.close();
                
                //   }else{

                //   }
                  
        }

    }else{

        alert("Please enter the details!")
    }

    
  
    
    //Add authentication headers in URL
    //var url = ['http://localhost:3010'+`/${meetingid}`, $.param(params)].join('?');
    
    //Open window
   // window.open(url);
    //var response=getAjaxToken(`/${meetingid}`,{'meetingid':meetingid,'meetingpassword':meetingpassword,'accessToken':localStorage.getItem('auth')})
    // console.log(response) 
    // var w = window.open('about:blank');
    // w.document.open();
    // w.document.write(response);
    // w.document.close();
    //window.open(response) // 
   // $( "html" ).replaceWith( response );
   //window.location.href = `/${meetingid}`
    return false
})


$("#startmeeting").click(function(){

    
    var yourmeetingid=$("#yourmeetingid").val().trim()
    var yourmeetingpassword=$("#yourmeetingpassword").val().trim()
    if(yourmeetingid.length>0 && yourmeetingpassword.length>0){
    var response=postAjaxToken("openMeeting",{'yourmeetingid':yourmeetingid,'yourmeetingpassword':yourmeetingpassword,'accessToken':localStorage.getItem('auth')})
    if(response.status==403 || response.status==401){
        alert("Please login! with valid credentials!")
    }else{
        localStorage.setItem("minfo",1001)
        var url = ('http://localhost:3010'+`/${yourmeetingid}`);
        // window.open(url,'_blank',"windowopen");
         openOnce(url, 'windowopen');


    }
    }else{
        alert("Please enter the details!")

    }
    return false;

})

function openOnce(url, target){
    // open a blank "target" window
    // or get the reference to the existing "target" window
    var winref = window.open('', target, '', true);

    // if the "target" window was just opened, change its url
    if(winref.location.href === 'about:blank'){
        winref.location.href = url;
    }
    console.log(winref)
    return winref;
}


})(jQuery);
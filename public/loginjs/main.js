
(function ($) {
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
    

/// login starts...//

$("#submitBtn").click(function(){
    var username=$("#username").val().trim()
    var password=$("#password").val().trim()
    if(username.length>0 && password.length>0){
    var response=postAjax("loginvalidate",{'username':username,'password':password})
     console.log(response)
     if(response['modalcode']=='success'){
      
     displaynormal('submitBtn',response)
    
      }else{
        displayerror('submitBtn',response)



      }

    }else{
      alert("Please enter username/password !")

    }
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

///refresh modal.....

// function refreshmodal(id){
//     $("#"+id).attr("data-toggle", "");
//       $('.okbutton').attr('id','')
  
//    }





$(".okbutton,.close").click(function(){
    $('#myModal').removeClass('show')
    $('#myModal').addClass('fade')

})

})(jQuery);
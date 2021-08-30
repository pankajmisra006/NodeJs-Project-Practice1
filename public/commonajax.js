//ajax calls///

// Method: GET
   //url: pass the url
   // data: passing the data in ajax formate

   postAjax=function (url,datajson){
    var response = null;
      $.ajax({
            type: "POST",
            url: url,
            data:datajson,
            async:false,
            success: function (data) {
                response=data
                //setTimeout( function() { top.location.href="view.php" }, 3000 );
            },
            error: function(data) {
                 response=data;
            }
    
        })
    return response;
    }
    
    // Method: POST
       //url: pass the url
       // data: passing the data in ajax formate
    
  
    //post ajax with token
    getAjaxToken=function (url,datajson){
        var response = null;
          $.ajax({
                type: "GET",
                url: url,
                headers: {
                    "Authorization": "Bearer " + datajson['accessToken']
                },
                data:datajson,
                async:false,
                
                success: function (data) {
                    response=data
                    //setTimeout( function() { top.location.href="view.php" }, 3000 );
                },
                error: function(data) {
                     response=data;
                }
        
            })
        return response;
        }




    //post ajax with token
    postAjaxToken=function (url,datajson){
        var response = null;
          $.ajax({
                type: "POST",
                url: url,
                headers: {
                    "Authorization": "Bearer " + datajson['accessToken']
                },
                data:datajson,
                async:false,
                
                success: function (data) {
                    response=data
                    //setTimeout( function() { top.location.href="view.php" }, 3000 );
                },
                error: function(data) {
                     response=data;
                }
        
            })
        return response;
        }
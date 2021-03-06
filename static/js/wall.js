$(document).ready(function () {
    // Normally, JavaScript runs code at the time that the <script>
    // tags loads the JS. By putting this inside a jQuery $(document).ready()
    // function, this code only gets run when the document finishing loading.

    $("#message-form").submit(handleFormSubmit);
    getMessages();
    $("#message-container").empty();
});


/**
 * Handle submission of the form.
 */
function handleFormSubmit(evt) {
    evt.preventDefault();

    var textArea = $("#message");
    var msg = textArea.val();

    console.log("handleFormSubmit: ", msg);
    addMessage(msg);


    // Reset the message container to be empty
    textArea.val("");
    $("#message-send").prop('disabled', true);
    setTimeout(function () {
        $("#message-send").prop('disabled', false);
    }, 5000);

    
}



// function getMessages() {
//     $.get("/api/wall/list", function (result) {
//         var msgs = result['messages'];
//         $("#message-container").empty(); 
//         for (var n=0; n<msgs.length; n++) {
//             $("#message-container").prepend("<li class='list-group-item'>" + msgs[n]['message'] + "</li>");
           
//         }
//     });
// }


/**
 * Makes AJAX call to the server and the message to it.
 */
function addMessage(msg) {
    $.post(
        "/api/wall/add",
        {'m': msg},
        function (data) {
            console.log("addMessage: ", data);
            displayResultStatus(data.result);
            if (msg) {
                getMessages(data);
            }
            
        }
    );

}


/**
 * This is a helper function that does nothing but show a section of the
 * site (the message result) and then hide it a moment later.
 */
function displayResultStatus(resultMsg) {
    var notificationArea;
    if (resultMsg === "Message Received") {
        notificationArea = $("#sent-result");}
    else
        {
        notificationArea = $("#sent-fail");}
    notificationArea.text(resultMsg);
    notificationArea.slideDown(function () {
        // In JavaScript, "this" is a keyword that means "the object this
        // method or function is called on"; it is analogous to Python's
        // "self". In our case, "this" is the #sent-results element, which
        // is what slideDown was called on.
        //
        // However, when setTimeout is called, it won't be called on that
        // same #sent-results element--"this", for it, wouldn't be that
        // element. We could put inside of our setTimeout call the code
        // to re-find the #sent-results element, but that would be a bit
        // inelegant. Instead, we'll use a common JS idiom, to set a variable
        // to the *current* definition of self, here in this outer function,
        // so that the inner function can find it and where it will have the
        // same value. When stashing "this" into a new variable like that,
        // many JS programmers use the name "self"; some others use "that".
        var self = this;

        setTimeout(function () {
            $(self).slideUp();
        }, 2000);




    });
}

function getMessages(data) {
    $.get("/api/wall/last", function(data){
        $("#message-container").prepend("<li class='list-group-item'>" + data + "</li>");
    });
}



$('#message-reset').click(function() {
        $.get("/api/wall/delete", function(result) {
            $("#message-container").empty();
            getMessages(result);
        });
});


    



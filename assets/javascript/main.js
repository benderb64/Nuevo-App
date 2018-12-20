var uid;
var userViewing;
var userPageHead = '<div id="main-content" class="container text-left mt-5">' +
                        
                    '</div>';

function displayUsers( ){

    $('#main-content').remove();
    
    firebase.database().ref().once( 'value' ).then( snap => {

        $('body').append(
            
            userPageHead
        );
        $.each( snap.val(), (v, i) => {
            firebase.database().ref( v ).once( 'value' ).then( childSnap => {

                $('#main-content').append(
                    
                    "<div class='row'>" + 
                        "<div id='"+ v +"' class='user-list col-12 bg-light border-bottom'>" + 
                            "<img src='" + childSnap.val().userPhoto + "' width='80' height='80' />" +
                            childSnap.val().username + "   Age: " + childSnap.val().age +
                        "</div>" +
                    "</div>"
                );
            });
        });
    });
}

function sendMsg( userId, myId, msg ){

    let temp;
    firebase.database().ref( userId +'/messages/' + myId + '/chat' ).transaction( curr => {

        if( curr )
            temp = curr + '<p style="color:green">' + msg + '</p>';
        else{ 
            temp = '<p style="color:green">' + msg + '</p>';
            
        }

        

        return temp;
    });

    firebase.database().ref( myId +'/messages/' + userId + '/chat' ).transaction( curr => {

        if( curr )
            temp = curr + '<p style="color:red">' + msg + '</p>';
        else{
            temp = '<p style="color:red">' + msg + '</p>';
            
        }

        return temp;
    });

}

function sendPage( userId ){

    $('#main-content').remove();
    userViewing = userId;
    firebase.database().ref( userId + "/").once( 'value' ).then( snap => {

        $('body').append(
            
            userPageHead
                
        );

        $('#main-content').append(

                '<div class="row bg-success">' +
                    '<div class="col-6">' +
                        '<img id="user-pic" src="' + snap.val().userPhoto +'" width="80"/>' +
                    '</div>' +
                    '<div class="col-6">' +
                        '<p>' + snap.val().username + '</p>' +
                    '</div>' +
                '</div>' +
                '<div class="row">' +
                    '<div class="col-12 bg-dark">' +
                        '<div id="msg-window" class="bg-dark" style="width:100%; height:300px; overflow: auto"></div>' + 
                    '</div>' +
                '</div>' +
                '<div class="row">' +
                    '<div class="col-12 input-group bg-light">' +
                        '<textarea class="form-control" id="chat-window"></textarea>' +
                        '<span id="send-btn" class="input-group-addon btn">SEND</span>' +
                    '</div>' +
                '</div>'
        
        );

        firebase.database().ref( uid + '/messages/' + userId + '/chat/' ).once('value').then( data => {

            $('#msg-window').html( data.val() );

        });
    });
}

function displayBio( userId ){

    $('#main-content').remove();
    
    userViewing = userId;
    firebase.database().ref( userId + "/" ).once( 'value').then( snap => {

        $('body').append(
            
            userPageHead
                    
        );

        $('#main-content').append(

            '<div class="row">' +
                    '<div class="col-4 bg-light"><img id="user-pic" src="' + snap.val().userPhoto +'" width="300"/></div>' +
                    '<div class="col-8 bg-light"><h1>' + snap.val().username +'</h1><h3>Age: ' + snap.val().age + '</h3>' +
                        '<button id="msg-page" type="button" >Send Message</button>' +
                    '</div>' +
                '</div>' +
                '<div class="row">' +
                    '<div class="col-12 bg-light"><p>' + snap.val().bio + '</p><a href="../index.html">Nuevo</a></div>' +
                '</div>' +
            '</div>'

        );
    });
}

function displayMsgs( ){

    $('#main-content').remove();
    firebase.database().ref( uid + "/messages/").once( 'value' ).then( snap => {

        $('body').append(
            
            userPageHead
        );
        $.each( snap.val(), (v, i) => {
            firebase.database().ref( v ).once( 'value' ).then( childSnap => {

                $('#main-content').append(
                    
                    "<div class='row'>" + 
                        "<div id='"+ v +"' class='msg-list col-12 bg-light border-bottom'>" + 
                            "<img src='" + childSnap.val().userPhoto + "' width='80' height='80' />" +
                            childSnap.val().username + "   Age: " + childSnap.val().age +
                        "</div>" +
                    "</div>"
                );
            });
        });
    });
}

function signUp( email, user, bio, userPhoto, pass, age ) {

    let fread = new FileReader(), pData, errorData;
    
    fread.onload = (e) => {
        
        pData = e.target.result;
    };
    fread.readAsDataURL( userPhoto.files[0] );
    firebase.auth().createUserWithEmailAndPassword(email, pass).catch( error => {
        
        errorData = error.code;
        var errorMessage = error.message;
        
        
    }).then( () => {

        uid = firebase.auth().currentUser.uid;
        console.log( pData );
        
        firebase.database().ref( uid ).set( { age : age, username : user, bio : bio, userPhoto : pData, isOnline: true })
            .then(() => {
                
                if( errorData === undefined ){
                    displayBio( uid );

                    firebase.database().ref( uid ).onDisconnect().update({

                        isOnline : false
                
                    });
        
                    firebase.database().ref( uid ).update({
        
                        isOnline : true
                
                    });

                    $('#link-list').prepend(
                        '<li class="nav-item">' +
                            '<a id="userTab" href="#"  class="nav-link" >Users<span class="sr-only"></span></a>' +
                        '</li>' +
                        '<li class="nav-item">' +
                            '<a id="messageTab" href="#"  class="nav-link" >Messages<span class="sr-only"></span></a>' +
                        '</li>' +
                        '<li class="nav-item">' +
                            '<a id="bioTab" href="#"  class="nav-link" >Bio<span class="sr-only"></span></a>' +
                        '</li>'
                    );

                    
                    firebase.database().ref( uid + '/messages/' ).on( 'child_added', data => {
        
        
                
                        $('#msg-window').html( data.val().chat );
                        
                    });
        
                    firebase.database().ref( uid + '/messages/' ).on( 'child_changed', data => {
                
                
                        
                        $('#msg-window').html( data.val().chat );
                        
                    });
                    
                }

                
                
            })
            .catch(error => console.log("Error when creating user data.", error));
    });   
}

function login( email, pass ){

    let errorData;
    firebase.auth().signInWithEmailAndPassword( email, pass ).catch(function(error) {
        errorData = error.code;
        console.log(error.message);
        
      }).then( ()=> {

        if( errorData === undefined ){
            uid = firebase.auth().currentUser.uid;

            firebase.database().ref( uid ).onDisconnect().update({

                isOnline : false
        
            });

            firebase.database().ref( uid ).update({

                isOnline : true
        
            });

            $('#link-list').prepend(
                '<li class="nav-item">' +
                    '<a id="userTab" href="#"  class="nav-link" >Users<span class="sr-only"></span></a>' +
                '</li>' +
                '<li class="nav-item">' +
                    '<a id="messageTab" href="#"  class="nav-link" >Messages<span class="sr-only"></span></a>' +
                '</li>' +
                '<li class="nav-item">' +
                    '<a id="bioTab" href="#"  class="nav-link" >Bio<span class="sr-only"></span></a>' +
                '</li>'
            );

            
            firebase.database().ref( uid + '/messages/' ).on( 'child_added', data => {
        
        
                
                $('#msg-window').html( data.val().chat );
                
            });

            firebase.database().ref( uid + '/messages/' ).on( 'child_changed', data => {
        
        
                
                $('#msg-window').html( data.val().chat );
                
            });
            

            displayUsers();
        }
        
    });
}

window.onload = function(){

    $('#create-user').on( "click", () => {
        userViewing = undefined;
        let userImage = document.getElementById("customfile");
        signUp( String( $("#email").val() ), String( $("#username").val() ), 
            String( $("#bio").val() ), userImage, String( $("#password").val() ), $("#age").val() );
    });

    $('#sign-in').on( "click", (e) => {
        userViewing = undefined;
        e.preventDefault();
        console.log("im clicked");
        login( String( $("#inputEmail").val() ), String( $("#inputPassword").val() ) );
    });

    $('body').on('click', '#userTab', () => {

        userViewing = undefined;
        displayUsers();
    });

    $('body').on('click', '#bioTab', () => {

        userViewing = undefined;
        displayBio( firebase.auth().currentUser.uid );
    });

    $('body').on('click', '.user-list' ,(i) => {
            
        userViewing = undefined;
        displayBio( i.currentTarget.id );
    });

    $('body').on('click', '#msg-page' ,() => {
            
        sendPage( userViewing );
    });

    $('body').on('click', '#send-btn' ,() => {
        
        sendMsg( userViewing, uid, $('#chat-window').val() );
        $('#chat-window').val('');
    });

    $('body').on('click', '#messageTab' ,() => {
            
        userViewing = undefined;
        displayMsgs();
    });

    $('body').on('click', '.msg-list' ,(i) => {
            
        sendPage( i.currentTarget.id );
    });

    
}
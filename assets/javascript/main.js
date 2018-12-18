var uid;

function displayUsers( ){

    /*$('body').html("");*/

    firebase.database().ref().on( 'value', snap => {

        $.each( snap.val(), (v, i) => {

            firebase.database().ref( v ).on( 'value', childSnap => {

                $('body').append(
                    
                    "<div style='background-color:gray'>" + childSnap.val().username + 
                    "<img src='" + childSnap.val().userPhoto + "' />" +
                    
                    
                    "</div>"
                );
            });
        });
    });
}

function displayBio(){

    $('body').html('');
    firebase.database().ref( uid + "/" ).on( 'value', snap => {

        $('body').append(
            
            '<div class="container">' +
            '<a href="../index.html">Nuevo</a>' +
                '<div class="row">' +
                    '<div id="eventTab" class="col-4 border-right border-bottom border-left bg-secondary"> Events </div>' +
                    '<div id="messageTab" class="col-4 border-right border-bottom bg-secondary"> Messages </div>'+
                    '<div id="bioTab" class="col-4 border-right bg-light"> Bio </div>' +
                '</div>' +
                '<div class="row">' +
                    '<div class="col-4 bg-light"><img id="user-pic" src="' + snap.val().userPhoto +'" /></div>' +
                    '<div class="col-8 bg-light"><h1>' + snap.val().username +'</h1><h3>Age: ' + snap.val().age + '</h3></div>' +
                '</div>' +
                '<div class="row">' +
                    '<div class="col-12 bg-light"><p>' + snap.val().bio + '</p></div>' +
                '</div>' +
            '</div>'
        );
    });
}

function signUp( email, user, bio, userPhoto, pass, age ) {

    let fread = new FileReader(), pData, errorData;
    
    fread.onload = (e) => { 
        
        pData = e.target.result;
    };
    fread.readAsDataURL( userPhoto.files[0] );
    firebase.auth().createUserWithEmailAndPassword(email, pass).catch( error =>  {
        
        errorData = error.code;
        var errorMessage = error.message;
        
        
    }).then( () => {

        uid = firebase.auth().currentUser.uid;
        console.log( pData );
        
        firebase.database().ref( uid ).set( { age : age, username : user, bio : bio, userPhoto : pData, isOnline: true })
            .then(() => {
                
                if( errorData === undefined )
                    displayBio();
                
            })
            .catch(error => console.log("Error when creating user data.", error));
    });   
}

function login( email, pass ){

    let errorData;
    firebase.auth().signInWithEmailAndPassword(email, pass).catch(function(error) {
        errorData = error.code;
        console.log(error.message);
        
      }).then( ()=> {

        if( errorData === undefined ){
            uid = firebase.auth().currentUser.uid;
            console.log(uid );

            firebase.database().ref( uid ).onDisconnect().update({

                isOnline : false
        
            });

            firebase.database().ref( uid ).update({

                isOnline : true
        
            });
        }

        displayBio();
    });
}

window.onload = function(){

    $('#create-user').on( "click", () => {

        let userImage = document.getElementById("customfile");
        signUp( String( $("#email").val() ), String( $("#username").val() ), 
            String( $("#bio").val() ), userImage, String( $("#password").val() ), $("#age").val() );
    });

    $('#sign-in').on( "click", (e) => {

        e.preventDefault();
        console.log("im clicked");
        login( String( $("#inputEmail").val() ), String( $("#inputPassword").val() ) );
    });

    
}
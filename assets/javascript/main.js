
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

function signUp( email, user, bio, userPhoto, pass, age ) {

    let errorData;
    let fread = new FileReader(), pData;
    
    fread.onload = (e) => { 
        
        pData = e.target.result;
    };
    fread.readAsDataURL( userPhoto.files[0] );
    firebase.auth().createUserWithEmailAndPassword(email, pass).catch( error =>  {
        
        errorData = error.code;
        var errorMessage = error.message;
        
        
    }).then( () => {

        let uid = firebase.auth().currentUser.uid;
        console.log( pData );
        
        firebase.database().ref( uid ).set( { age : age, username : user, bio : bio, userPhoto : pData, isOnline: true })
            .then(() => {
                
                if( errorData === undefined )
                    displayUsers();
                
            })
            .catch(error => console.log("Error when creating user data.", error));
    });   
}

function login( email, pass ){

    let errorData;
    firebase.auth().signInWithEmailAndPassword(email, pass).catch(function(error) {
       
        errorData = error.code;
        
        var errorMessage = error.message;
        console.log(error.message);
        
      }).then( ()=> {

        if( errorData === undefined ){
            let uid = firebase.auth().currentUser.uid;
            console.log(uid );

            firebase.database().ref( uid ).onDisconnect().update({

                isOnline : false
        
            });

            firebase.database().ref( uid ).update({

                isOnline : true
        
            });

            firebase.database().ref( uid + "/userPhoto").on( 'value', snap => {  
                $('body').append(

                    "<img src='" + snap.val() + "' />"

                );
            });
        }
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
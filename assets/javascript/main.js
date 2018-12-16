
function displayUsers( ){

    /*$('body').html("");*/

    firebase.database().ref().on( 'value', snap => {

        $.each( snap.val(), (v, i) => {

            firebase.database().ref( v ).on( 'value', childSnap => {

                $('body').append(
                    
                    "<div style='background-color:gray'>" + childSnap.val().username + "</div>"
                );
            });
        });
        
    });
}

function signUp( email, user, bio, userPhoto, pass, age ) {

    let fread = new FileReader(), pData;
    
    fread.onload = (e) => { 
        
        pData = e.target.result;
    };
    fread.readAsDataURL( userPhoto.files[0] );
    firebase.auth().createUserWithEmailAndPassword(email, pass).catch( error =>  {
        
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log( errorMessage );
        
    }).then( ()=> {

        let uid = firebase.auth().currentUser.uid;
        console.log( pData );
        
        firebase.database().ref( uid ).set( { age : age, username : user, bio : bio, userPhoto : pData })
            .then(() => {
                
                displayUsers();
                
            })
            .catch(error => console.log("Error when creating user data.", error));
    });   
}



window.onload = function(){

    $('#create-user').on( "click", () => {

        let userImage = document.getElementById("customfile");
        signUp( String( $("#email").val() ), String( $("#username").val() ), 
            String( $("#bio").val() ), userImage, String( $("#password").val() ), $("#age").val() );
    });

    
    
}
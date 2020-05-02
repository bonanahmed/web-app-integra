// // Your web app's Firebase configuration
// var firebaseConfig = {
//   apiKey: "AIzaSyDnfO0Y5u8iQFW2GrIES0wVgQ9V0Bi81uw",
//   authDomain: "web-app-integra.firebaseapp.com",
//   databaseURL: "https://web-app-integra.firebaseio.com",
//   projectId: "web-app-integra",
//   storageBucket: "web-app-integra.appspot.com",
//   messagingSenderId: "645403584501",
//   appId: "1:645403584501:web:1d60b998bb8c98bc2362bc",
//   measurementId: "G-VTEPDW8S39"
// };

// Your web app's Firebase configuration/integra email integra-web-app project
  var firebaseConfig = {
    apiKey: "AIzaSyCxgQuEzC6L9CLT43LRw95hqs9TOdn3lhc",
    authDomain: "integra-web-app.firebaseapp.com",
    databaseURL: "https://integra-web-app.firebaseio.com",
    projectId: "integra-web-app",
    storageBucket: "integra-web-app.appspot.com",
    messagingSenderId: "964841352253",
    appId: "1:964841352253:web:a5bd0eea4fd987be9f4e54",
    measurementId: "G-T8J7SV3W0S"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

function signOut() {
  firebase
    .auth()
    .signOut()
    .then(function() {
      // Sign-out successful.
    })
    .catch(function(error) {
      // An error happened.
      console.log("Error : " + error);
    });
}

/**
 * Handles the sign in button press.
 */
function signIn() {
  const userEmail = document.getElementById("login-email").value;
  const userPassword = document.getElementById("login-password").value;

  if (userEmail.length < 4) {
    alert("Please enter an email address.");
    return;
  }
  if (userPassword.length < 4) {
    alert("Please enter a password.");
    return;
  }
  // Sign in with email and pass.
  // [START authwithemail]
  firebase
    .auth()
    .signInWithEmailAndPassword(userEmail, userPassword)
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if (errorCode === "auth/wrong-password") {
        alert("Wrong password.");
      } else {
        alert(errorMessage);
      }
      document.location.reload();
      // [END_EXCLUDE]
    });
  // [END authwithemail]
}

function handleSignUp() {
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  if (email.length < 4) {
    alert("Please enter an email address.");
    return;
  }
  if (password.length < 4) {
    alert("Please enter a password.");
    return;
  }
  // Create user with email and pass.
  // [START createwithemail]
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if (errorCode == "auth/weak-password") {
        alert("The password is too weak.");
      } else {
        alert(errorMessage);
      }
      console.log(error);
      // [END_EXCLUDE]
    });
  // [END createwithemail]
}

/**
 * Sends an email verification to the user.
 */
function sendEmailVerification() {
  // [START sendemailverification]
  firebase
    .auth()
    .currentUser.sendEmailVerification()
    .then(function() {
      // Email Verification sent!
      // [START_EXCLUDE]
      alert("Email Verification Sent!");
      // [END_EXCLUDE]
    });
  // [END sendemailverification]
}

function sendPasswordReset() {
  var email = document.getElementById("email").value;
  // [START sendpasswordemail]
  firebase
    .auth()
    .sendPasswordResetEmail(email)
    .then(function() {
      // Password Reset Email Sent!
      // [START_EXCLUDE]
      alert("Password Reset Email Sent!");
      // [END_EXCLUDE]
    })
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if (errorCode == "auth/invalid-email") {
        alert(errorMessage);
      } else if (errorCode == "auth/user-not-found") {
        alert(errorMessage);
      }
      console.log(error);
      // [END_EXCLUDE]
    });
  // [END sendpasswordemail];
}

let userDisplayName;
let userEmail;
let userEmailVerified;
let userPhotoURL;
let userisAnonymous;
let useruid;
let userProviderData;
let userToken;

function initApp() {
  let url = "http://localhost:8080/";
  // let url = "http://integra-tech.co.id/";
  // Listening for auth state changes.
  // [START authstatelistener]
  firebase.auth().onAuthStateChanged(function(firebaseuser) {
    // // [START_EXCLUDE silent]
    // document.getElementById("quickstart-verify-email").disabled = true;
    // // [END_EXCLUDE]
    if (firebaseuser && window.location != `${url}dashboard.html`) {
      console.log(firebaseuser);
      window.location = `${url}dashboard.html`;
    } else if (
      !firebaseuser &&
      window.location != `${url}login.html` &&
      window.location != `${url}register.html`
    ) {
      console.log("not logged in");
      window.location = `${url}login.html`;
    }

    if (firebaseuser) {
      // firebaseuser is signed in.
      userDisplayName = firebaseuser.displayName;
      userEmail = firebaseuser.email;
      userEmailVerified = firebaseuser.emailVerified;
      userPhotoURL = firebaseuser.photoURL;
      userisAnonymous = firebaseuser.isAnonymous;
      useruid = firebaseuser.uid;
      userProviderData = firebaseuser.providerData;
      // userToken = firebaseuser.getToken();
      panelData(useruid);
    }
  });
}

window.onload = function() {
  initApp();
};

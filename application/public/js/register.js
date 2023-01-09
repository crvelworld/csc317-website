//Listen to submit register
document.getElementById("register").addEventListener("submit", function (ev) {
  //If all manually checked forms are valid then continue
  if (document.getElementsByClassName("valid").length == 3) {
    return true;
  }
  else {
    ev.preventDefault();
  }
});


function verifyUsername() {
  //Get username value and assign it
  let username = document.getElementById("username").value;
  let returnVal = true;

  //Check if username starts with a character
  if (!username.charAt(0).match(new RegExp(/[A-z]/))) {
    document.getElementById("charRequ").classList.add("invalidText");
    returnVal = false;
  } else {
    document.getElementById("charRequ").classList.add("validText");
  }
  //Check if username contains at least 3 characters and has 1 number
  if (username.length < 3 || !username.match(new RegExp(/[A-z]+[0-9]/))) {
    document.getElementById("lengthRequ").classList.add("invalidText");
    returnVal = false;
  } else {
    document.getElementById("lengthRequ").classList.add("validText");
  }
  return returnVal;
}

function verifyPassword() {
  //Get password value and assign it
  let password = document.getElementById("password").value;
  let returnVal = true;

  //Check if password is at least length 8
  if (password.length <= 8) {
    document.getElementById("lengthRequ").classList.add("invalidText");
    returnVal = false;
  } else {
    document.getElementById("lengthRequ").classList.add("validText");
  }
  //Check if password has an uppercase letter
  if (!password.match(new RegExp(/[A-Z]/))) {
    document.getElementById("upperRequ").classList.add("invalidText");
    returnVal = false;
  } else {
    document.getElementById("upperRequ").classList.add("validText");
  }
  //Check if password has a lower case letter
  if (!password.match(new RegExp(/[a-z]/))) {
    document.getElementById("lowerRequ").classList.add("invalidText");
    returnVal = false;
  } else {
    document.getElementById("lowerRequ").classList.add("validText");
  }
  //Check if password contains a number
  if (!password.match(new RegExp(/[0-9]/))) {
    document.getElementById("numRequ").classList.add("invalidText");
    returnVal = false;
  } else {
    document.getElementById("numRequ").classList.add("validText");
  }
  //Check if password contains a special character
  if (!password.match(new RegExp(/[/*\-+!@#$^&~[\]]/))) {
    document.getElementById("specRequ").classList.add("invalidText");
    returnVal = false;
  } else {
    document.getElementById("specRequ").classList.add("validText");
  }
  return returnVal;
}

function confirmPassword() {
  //Get passwords
  let iPassword = document.getElementById("password").value;
  let fPassword = document.getElementById("confirmpassword").value;
  let returnVal = true;

  //Check if both passwords match each other
  if (!(fPassword == iPassword)) {
    document.getElementById("confirmPass").classList.add("invalidText");
    returnVal = false;
  } else document.getElementById("confirmPass").classList.add("validText");
  return returnVal;
}

//Listen to register input fields
document.getElementById("register").addEventListener("input", function (ev) {
  //Set initial error window display value
  document.getElementById("errorWindow").style.display = "inherit";
  //Switch case that handles current input field
  switch (ev.target) {
    case username:
      document.getElementById("errorText").innerHTML =
        `<p id="charRequ">Username must start with a character</p>
      <p id="lengthRequ">Username must be at least 3 alphanumerical characters</p>`;
      if (verifyUsername()) {
        document.getElementById("username").classList.remove("invalid");
        document.getElementById("username").classList.add("valid");
      } else {
        document.getElementById("username").classList.remove("valid");
        document.getElementById("username").classList.add("invalid");
        verifyUsername();
      }
      break;

    case password:
      document.getElementById(
        "errorText"
      ).innerHTML = `<p id="lengthRequ">Password must at least be 8 more characters</p>
      AND
      <p id="upperRequ">At least 1 uppercase letter</p>
      AND
      <p id="lowerRequ">At least 1 lowercase letter</p>
      AND
      <p id="numRequ">At least 1 number</p>
      AND
      <p id="specRequ">At least 1 of the following special characters: /*-+!@#$^&~[]</p>`;
      if (verifyPassword()) {
        document.getElementById("password").classList.remove("invalid");
        document.getElementById("password").classList.add("valid");
      } else {
        document.getElementById("password").classList.remove("valid");
        document.getElementById("password").classList.add("invalid");
        verifyPassword();
      }
      break;
    case confirmpassword:
      document.getElementById(
        "errorText"
      ).innerHTML = `<p id="confirmPass">Passwords must match</p>`;
      if (confirmPassword()) {
        document.getElementById("confirmpassword").classList.remove("invalid");
        document.getElementById("confirmpassword").classList.add("valid");
      } else {
        document.getElementById("confirmpassword").classList.remove("valid");
        document.getElementById("confirmpassword").classList.add("invalid");
        confirmPassword();
      }
      break;
    default:
      document.getElementById("errorWindow").style.display = "none";
  }
});

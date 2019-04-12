// //// PSEUDOCODE
// CREATE A START AND END LIMIT FOR SCHEDULING
// ERROR TEXT IF THE ENTERED PARAMETERS ARE NOT WITHIN LIMITS. PREVENT FORM FROM SUBMITTING IF ALL FIELDS ARE NOT FILLED OUT AND/OR INCORRECT
// START = NO TIME BEFORE 6:00
// END = NO TIME AFTER 23:59
// FREQUENCY = CAN NOT EXCEED A CERTAIN NUMBER, MAX TIME AVAILABLE IS 1079 MINUTES, BUT IF I CAN MAKE THE INPUT RELATIVE TO START TIME, I CAN SET THE UPPER LIMIT
// I.E. IF START = 6 THEN MAX FREQUENCY = 1079 ELSE (MOMENT - 6) - 1079
// FREQUENCY ARRAY = LOOP A RANGE OF VALUES FOR TRAIN TIMES FROM START TIME TO WHEREVER THE END TIME WOULD BE 
// NEXT ARRIVAL IS THE CURRENT TIME COMPARED TO THE ARRAY WHICH MATCHES THE NEXT CLOSEST HIGHEST VALUE 
// MINUTES AWAY IS CALCULATED AS MOMENT - NEXT ARRIVAL

// CREATE GLOBAL VARIABLES

var start = 360;
var end = 

// CALL THE FIREBASE INSTANCE SETUP FOR THE TRAINS
var config = {
    apiKey: "AIzaSyDlCdIz-aBbnPplZanUqqup22xdCUQlLr8",
    authDomain: "trainschedulerextraordinaire.firebaseapp.com",
    databaseURL: "https://trainschedulerextraordinaire.firebaseio.com",
    projectId: "trainschedulerextraordinaire",
    storageBucket: "trainschedulerextraordinaire.appspot.com",
    messagingSenderId: "606497313970"
};
firebase.initializeApp(config);

var database = firebase.database();

// INPUT VALIDATION WITH LIMITS FOR FORM
function nameCheck() {
    var x, text;

    // Get the value of the input field with id="train-name-input"
    x = document.getElementById("train-name-input").value;
    // IF x IS null ERROR, OTHERWISE ACCEPT
    if (x.length === 0) {
        text = "Please enter a name. Any name would be fine.";
    } else {
        text = "NAME RECOGNIZED.";
    }
    document.getElementById("train-name-validation").innerHTML = text;
};

function destinationCheck() {
    var x, text;

    // Get the value of the input field with id="destination-input"
    x = document.getElementById("destination-input").value;
    // IF x IS null ERROR, OTHERWISE ACCEPT
    if (x.length === 0) {
        text = "Please enter a destination. Any destination would be fine.";
    } else {
        text = "DESTINATION RECOGNIZED.";
    }
    document.getElementById("destination-validation").innerHTML = text;
};

// MILITARY TIME CHECK FUNCTION
// having the variable in the function the same as calling a blank variable??? i.e. var militaryTime; 
function checkMilitaryTime(militaryTime) {
    // Check to make sure something was entered
    if (militaryTime == null) {
        return false;
    }
    // Check to make sure there are 5 characters
    if (militaryTime.length() != 5) {

        return false;
    }

    // Storing characters into char variable 
    var hourOne = militaryTime.charAt(0);
    var hourTwo = militaryTime.charAt(1);
    var colon = militaryTime.charAt(2);
    var minuteOne = militaryTime.charAt(3);
    var minuteTwo = militaryTime.charAt(4);

    //first position of hour must be 0 or 1 or 2
    if (hourOne != '0' && hourOne != '1' && hourOne != '2') {

        return false;
    }
    //if first position of hour is 0 or 1 then second
    //position must be 0-9
    if (hourOne == '0' || hourOne == '1') {

        if (hourTwo < '0' || hourTwo > '9') {
            return false;
        }

        //if hourOne equal 2 then second position must be 0-3
    } else {

        if (hourTwo < '0' || hourTwo > '3') {
            return false;
        }
    }
    //third position must be colon
    if (colon != ':') {

        return false;
    }
    // fourth position must be 0-5
    if (minuteOne < '0' || minuteOne > '5') {
        return false;
    }

    //fifth position must be 0-9
    if (minuteTwo < '0' || minuteTwo > '9') {
        return false;
    }
    // String is valid military time
    return true;
};

function startTimeCheck() {
    var x, text;

    checkMilitaryTime();
    if (checkMilitaryTime != true) {
        text = "Please enter a the time in the correct format --> (HH:MM)."
    };

    // Get the value of the input field with id="start-time-input"
    x = document.getElementById("start-time-input").value;
    var militaryTime = moment(x, "HH:mm");
    var startHours = moment(militaryTime).format("kk");   // PARSED AS HOURS
    var startMinutes = moment(militaryTime).format("mm");   // PARSED AS MINUTES
    var startTime = parseInt(startHours) * 60 + parseInt(startMinutes);
    console.log([startHours, startMinutes, startTime]);

    // IF x IS NaN OR START TIME IS LESS THAN 6 OR GREATER THAN 24
    if (isNaN(startTime) || startTime < 360 || startTime > 1440) {
        text = "No train runs earlier than 6 or later than Midnight";
    } else {
        // TODO: insert a favicon instead of filler text below
        text = "ROGER, ROGER";
    };
    document.getElementById("start-time-validation").innerHTML = text;
};

function frequencyCheck() {
    var x, text;


    // FREQUENCY = CAN NOT EXCEED A CERTAIN NUMBER, MAX TIME AVAILABLE IS 1079 MINUTES, BUT IF I CAN MAKE THE INPUT RELATIVE TO START TIME, I CAN SET THE UPPER LIMIT
    // I.E. IF START = 6 THEN MAX FREQUENCY = 1079 ELSE (MOMENT - 6) - 1079
    // FREQUENCY ARRAY = LOOP A RANGE OF VALUES FOR TRAIN TIMES FROM START TIME TO WHEREVER THE END TIME WOULD BE 

    // Get the value of the input field with id="frequency-input"
    x = document.getElementById("frequency-input").value;
    console.log(typeof x);

    // IF x IS NaN OR START TIME IS LESS THAN 6 OR GREATER THAN 24
    if (isNaN(x) || x > 1080) {
        text = "No train runs for longer than a day";
    } else {
        // TODO: insert a favicon instead of filler text below
        text = "ROGER, ROGER";
    }
    document.getElementById("frequency-validation").innerHTML = text;
};

// BUTTON FOR ADDING FORM INFORMATION
$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    nameCheck();
    destinationCheck();
    startTimeCheck();
    frequencyCheck();

    // USER INPUT TO PASS ON BUTTON CLICK
    var trainName = $("#train-name-input").val().trim();
    var trainDest = $("#destination-input").val().trim();
    var trainStart = moment($("#start-time-input").val().trim(), "HH:mm").format("X");
    var trainFreq = $("#frequency-input").val().trim();

    // TEMP OBJECT TO HOLD FORM INPUT
    var newTrain = {
        name: trainName,
        dest: trainDest,
        start: trainStart,
        freq: trainFreq
    };

    // UPLOAD THE FORM DATA TO FIREBASE DB
    database.ref().push(newTrain);

    console.log([newTrain.name, newTrain.dest, (typeof newTrain.dest), newTrain.start, newTrain.freq]);

    alert("Employee successfully added");

    // CLEAR THE FORM ONCE DATA UPLOADED TO DB
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#start-time-input").val("");
    $("#frequency-input").val("");
});

// CALL THE DATA FROM THE FIREBASE DB TO APPEND TO TABLE
database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    // STORE AS VARIABLES
    var trainName = childSnapshot.val().name;
    var trainDest = childSnapshot.val().dest;
    var trainStart = childSnapshot.val().start;
    var trainFreq = childSnapshot.val().freq;

    console.log([trainName, trainDest, trainStart, trainFreq]);

    // FORMAT START TIME
    var trainStartPretty = moment.unix(trainStart).format("HH:mm");

    // Calculate the months worked using hardcore math
    // To calculate the months worked
    var trainMonths = moment().diff(moment(trainStart, "X"), "months");
    console.log(trainMonths);

    // Calculate the total billed rate
    var trainBilled = trainMonths * trainFreq;
    console.log(trainBilled);

    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDest),
        $("<td>").text(trainStartPretty),
        $("<td>").text(trainMonths),
        $("<td>").text(trainFreq),
        $("<td>").text(trainBilled)
    );

    // Append the new row to the table
    $("#train-table > tbody").append(newRow);
});

  // Example Time Math
  // -----------------------------------------------------------------------------
  // Assume Employee start date of January 1, 2015
  // Assume current date is March 1, 2016

  // We know that this is 15 months.
  // Now we will create code in moment.js to confirm that any attempt we use meets this test case

//   $(document.body).ready(function () {



// });
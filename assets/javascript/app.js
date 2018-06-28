// Initialize Firebase
var config = {
    apiKey: "AIzaSyDzmYNuXx5iiP_KfbUdt63sdKo8Et7x9JQ",
    authDomain: "trainscheduler-f334c.firebaseapp.com",
    databaseURL: "https://trainscheduler-f334c.firebaseio.com",
    projectId: "trainscheduler-f334c",
    storageBucket: "trainscheduler-f334c.appspot.com",
    messagingSenderId: "969072755812"
};
firebase.initializeApp(config);

var database = firebase.database();

// var currentTime = null;

// function updateTime() {
//     currentTime = moment().format("HH:mm:ss");
// }

$(document).ready(function() {
    // updateTime();
    //Button to add new trains
    $("#add-train").on("click", function(event) {
        event.preventDefault();

        // Acquires user input from the form
        var trainName = $("#name-input").val().trim();
        var trainDestination = $("#destination-input").val().trim();
        var trainTime = $("#time-input").val().trim();
        var trainFrequency = $("#frequency-input").val().trim();

        // Uploads the data acquired from the user to the Firebase database
        database.ref().push({
            name: trainName,
            destination: trainDestination,
            time: trainTime,
            frequency: trainFrequency
        })

        // Clears form inputs upon submission
        $("#name-input").val("");
        $("#destination-input").val("");
        $("#time-input").val("");
        $("#frequency-input").val("");
    })

    // Creates a Firebase event to add trains to the database
    database.ref().on("child_added", function(snapshot) {
        var trainName = snapshot.val().name;
        var trainDestination = snapshot.val().destination;
        var trainTime = snapshot.val().time;
        var trainFrequency = snapshot.val().frequency;

        console.log(trainTime)

        // Converts the train time
        var convertedTime = moment(trainTime, "HH:mm");
        console.log("Converted time: " + convertedTime);

        // The difference between the first train time and the current time
        var timeDiff = moment().diff(moment(convertedTime), "minutes");
        console.log("Time difference: " + timeDiff);

        // Takes the absolute value of the difference to address hours between 0000-1100
        Math.abs(timeDiff)

        var remainder = timeDiff % trainFrequency;
        console.log("Remainder: " + remainder)
        
        var minutesAway = trainFrequency - remainder;
        console.log("Minutes away: " + minutesAway)

        var nextTrain = moment().add(minutesAway, "minutes");
        
        var nextArrival = moment(nextTrain, "HH:mm").format("hh:mm a");
        console.log(nextArrival)

        // Adds a new row to the HTML table
        $("#new-train").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + "Every " + trainFrequency + " minute(s)" + "</td><td>" + nextArrival +  "</td><td>" + minutesAway + "</td></tr>")
    }, function(errorObject) {
        console.log("Errors: " + errorObject.code);
    })
})
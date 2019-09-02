const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.users_unblocked = functions.https.onRequest((req, res) => {
    /* Instead use the admin */
    if (req.method !== "POST") {
        res.status(400).send('Please send a POST request');
        return;
    }
    
    const ref = admin.database().ref('users');

    ref.on("value", function(snapshot) {
        snapshot.forEach(function(child) {
            var objeto = child.val()
            child.ref.update({
                countAgendas: 0,
                countReserved: 0,
                messageEvent: '',
                reserved: false
            })

        });
        res.send(snapshot.val());
    });
  });

exports.updateTurns_T1 = functions.https.onRequest((req,res)=> {
    const refTherapist1 = admin.database().ref('terapeuta1');

    refTherapist1.on("value", function(snapshot) {
        snapshot.forEach(function(child) {
            child.ref.update({
                available: true,
                confirm: false,
                userName: '',
                count: 0
            });
        });
        res.send(snapshot.val());
    });
  });

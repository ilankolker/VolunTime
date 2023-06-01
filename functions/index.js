
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Send chat-gpt our query

exports.generateVolunteers = functions.https.onCall(async (data, context) => {

    age = data.age
    location = data.location
    hobbies = data.hobbies
    //how far will you go to make a diffrenece?
    availabilty = data.availabilty
    

    res = chatgpt.send(propt.replace("age", age, "location", location, "hobbies",
                                     hobbies, "availabilty", availabilty))
    
    // add all volunteers to db if not exists


    return res
})

// We get a key of the volunteering and user data and add the user to the volunnteering table

// auth trigger (new join us)

exports.addUserToVolunteering = functions.onCall(async (data, context) => {
    admin.firestore().collection('volunteering').doc(data.volunteering.website, data.volunteering.location).set({

        volunteers: volunteers.push(data.user.id)
    })

})

// add a new volunteering if it doesnt exist

exports.addVolunteering = functions.onCall(async (data, context) =>{
    admin.firestore().collection('volunterring').doc(data.volunteering.website, data.volunteering.location).set({
        website: data.volunteering.website,
        location: data.volunteering.location,
        name: data.volunteering.name,
        description: data.volunteering.description,
        volunteers: []
    })

})

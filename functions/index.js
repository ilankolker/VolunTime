const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const { Configuration, OpenAIApi } = require("openai");

// Set up OpenAI client
const configuration = new Configuration({
    organization: "org-W1xrGR4WAmmdeqk5vOBvlntj",
    apiKey: "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",
});

const openai = new OpenAIApi(configuration);


// Export functions
const prompt = "Give me a 1-5 list of specific places to volunteer, in %location%, for %age% years old with %availability% free hours a week and likes: %hobbies%. Give a description of 20 words max for each option in the format 'name: description'. Don't give an intro. After the 5th option, add an explanation of 20 words max of why you chose the first option in this format: 'Explanation: <explanation>'."

exports.generateVolunteers = functions.region('europe-west1').https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "You must be authenticated");
    }

    const age = data.age;
    const location = data.location;    
    const availability = data.available;  
    const hobbies = data.hobbies.join(", ");
    
    let messages = [{ 
        role: "user", 
        content: prompt.replace("%location%", location).replace("%age%", age).replace("%availability%", availability).replace("%hobbies%", hobbies)
    }]

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages
    });

    response = completion.data.choices[0].message.content;
    
    volunteerPositions = response.split("\n");
    volunteerPositions = volunteerPositions.map(position => {
        position = position.substring(3, position.length - 1);
        return position.split(": ");
    });

    return JSON.stringify({ success: true, volunteerPositions: volunteerPositions });
});

exports.getVolunteerPosition = functions.region('europe-west1').https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "You must be authenticated");
    }

    if(context.auth.uid != data.uid) {
        throw new functions.https.HttpsError("permission-denied", "You do not have permission to access this resource");
    }

    const doc = await admin.firestore().collection('users').doc(data.uid).get();

    if(!doc || !doc.exists || doc.data().volunteerPosition == null) {
        return JSON.stringify({ volunteerPosition: null });
    }
    
    return JSON.stringify({ success: true, volunteerPosition: doc.data().volunteerPosition });
});

exports.setVolunteerPosition = functions.region('europe-west1').https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "You must be authenticated");
    }

    if(context.auth.uid != data.uid) {
        throw new functions.https.HttpsError("permission-denied", "You do not have permission to access this resource");
    }

    let user = await admin.firestore().collection('users').doc(data.uid).get();

    // If the user already has a volunteer position, remove them from it
    if(user && user.exists && user.data().volunteerPosition != null) {
        await admin.firestore().collection('volunteerPositions').doc(user.data().volunteerPosition).update({
            users: admin.firestore.FieldValue.arrayRemove(data.uid)
        });

        await admin.firestore().collection('users').doc(data.uid).set({
            volunteerPosition: null
        });
    }

    // If no new volunteer position is being set, return
    if(data.volunteerPosition == null) {
        return JSON.stringify({ success: true, volunteerPosition: null });
    }

    // Add a new record of the volunteer position if it does not exist/get the existing one
    let volunteerPosition = await admin.firestore().collection('volunteerPositions').doc(data.volunteerPosition).get();

    // Update the user's volunteer position
    if(!volunteerPosition || !volunteerPosition.exists) {
        await admin.firestore().collection('volunteerPositions').doc(data.volunteerPosition).set({
            users: admin.firestore.FieldValue.arrayUnion(data.uid)
        });
    } else {
        await admin.firestore().collection('volunteerPositions').doc(data.volunteerPosition).update({
            users: admin.firestore.FieldValue.arrayUnion(data.uid)
        });
    }

    await admin.firestore().collection('users').doc(data.uid).set({
        volunteerPosition: data.volunteerPosition
    });

    return JSON.stringify({ success: true, volunteerPosition: data.volunteerPosition });
});


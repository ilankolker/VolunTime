const requestModal = document.querySelector('.new-request');
const requestLink = document.querySelector('.add-request');

// open request modal
requestLink.addEventListener('click', () => {
  requestModal.classList.add('open');
});

// close request modal
requestModal.addEventListener('click', (e) => {
  if (e.target.classList.contains('new-request')) {
    requestModal.classList.remove('open');
  }
});













// const requestModal = document.querySelector('.new-request');
// const requestLink = document.querySelector('.add-request');

// // open request modal
// requestLink.addEventListener('click', () => {
//   requestModal.classList.add('open');
// });

// // close request modal
// requestModal.addEventListener('click', (e) => {
//   if (e.target.classList.contains('new-request')) {
//     requestModal.classList.remove('open');
//   }
// });

// // say hello function call
// const button = document.querySelector('.call');
// button.addEventListener('click', () => {
// // get function reference
//   const generateVolunteers = firebase.app().functions('europe-west1').httpsCallable('generateVolunteers');
//   // call the function and pass data
//   generateVolunteers({ age: 22, location: "Jerusalem", availability: 5, 
//       hasVolunteered: false, hobbies: ["Programming", "Working out"] }).then(result => {
//     console.log(JSON.parse(result.data));
//   });
// });
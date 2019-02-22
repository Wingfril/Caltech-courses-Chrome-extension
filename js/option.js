var number_of_comments = 5;
var description_of_class = true;
var class_rating = true;
var username = "nope";
var password = "nope";


// The ID of the extension we want to talk to.
var editorExtensionId = chrome.runtime.id;

document.querySelector('#saving').addEventListener("click", function(){

  class_rating = document.getElementById('Course: Overall Ratings').checked;
  pro_ratings = document.getElementById('Prof: Overall Ratings').checked;

  description_of_class = document.getElementById('description_of_class').checked;
  username = document.getElementById('username').value;
  password = document.getElementById('pw').value;
  number_of_comments = document.getElementById('Comments').value;
  reasons = document.getElementById('Reasons').checked;
  grades = document.getElementById('Grade distribution').checked;
  lectures = document.getElementById('Lectures attended').checked;
  amount = document.getElementById('Amount of work').checked;
  hours = document.getElementById('Hours').checked;

  //Grade distribution
  chrome.runtime.sendMessage(editorExtensionId, {username: username, password: password},
    function(response) {
      console.log("sending????");
      console.log(response);
      if (!response.success)
        handleError(url);
    });


  chrome.storage.local.set({Cratings: class_rating}, function () {});
  chrome.storage.local.set({comments: number_of_comments}, function () {});
  chrome.storage.local.set({description_of_class: description_of_class}, function () {  });
  chrome.storage.local.set({grades: grades}, function () {});
  chrome.storage.local.set({lectures: lectures}, function () {});
  chrome.storage.local.set({Pratings: pro_ratings}, function () {});
  chrome.storage.local.set({reasons: reasons}, function () {});
  chrome.storage.local.set({hours: hours}, function () {});

  chrome.storage.local.set({amount: amount}, function () {});

  alert("Settings saved");
});

function handleError(url)
{
  alert("Some internal erro occurred; the username and pw were not set");
}

window.onload = function() {

  chrome.storage.local.get('Cratings', function (result) {
    console.log(result);
    if(result.Cratings !== undefined)
    {
      document.getElementById('Course: Overall Ratings').checked = result.Cratings;
    }
    else {
      chrome.storage.local.set({Cratings: true}, function () {});
      document.getElementById('Course: Overall Ratings').checked = true;
    }
  });

  chrome.storage.local.get('comments', function (result) {
    if(result.comments !== undefined)
    {
      document.getElementById('comments').value = result.comments;
    }
    else {
      chrome.storage.local.set({comments: number_of_comments}, function () {});
    }
  });

  chrome.storage.local.get('description_of_class', function (result) {
    console.log(result);

    if(result.description_of_class !== undefined)
    {
      document.getElementById('description_of_class').checked = result.description_of_class;
    }
    else {
      chrome.storage.local.set({description_of_class: description_of_class}, function () {});
    }
  });

  chrome.storage.local.get('grades', function (result) {
    if(result.grades !== undefined)
    {
      document.getElementById('Grade distribution').checked = result.grades;
    }
    else {
      chrome.storage.local.set({grades: true}, function () {});
      document.getElementById('Grade distribution').checked = true;
    }
  });

  chrome.storage.local.get('hours', function (result) {
    if(result.hours !== undefined)
    {
      document.getElementById('Hours').checked = result.hours;
    }
    else {
      chrome.storage.local.set({hours: true}, function () {});
      document.getElementById('Hours').checked = true;
    }
  });

  chrome.storage.local.get('lectures', function (result) {
    if(result.lectures !== undefined)
    {
      document.getElementById('Lectures attended').checked = result.lectures;
    }
    else {
      chrome.storage.local.set({lectures: true}, function () {});
      document.getElementById('Lectures attended').checked = true;
    }
  });

  chrome.storage.local.get('Pratings', function (result) {
    if(result.Pratings !== undefined)
    {
      document.getElementById('Prof: Overall Ratings').checked = result.Pratings;
    }
    else {
      chrome.storage.local.set({Pratings: true}, function () {});
      document.getElementById('Prof: Overall Ratingss').checked = true;
    }
  });

  chrome.storage.local.get('amount', function (result) {
    if(result.amount !== undefined)
    {
      document.getElementById('Amount of work').checked = result.amount;
    }
    else {
      chrome.storage.local.set({amount: true}, function () {});
      document.getElementById('Amount of work').checked = true;
    }
  });

  chrome.storage.local.get('reasons', function (result) {
    if(result.reasons !== undefined)
    {
      document.getElementById('Reasons').checked = result.reasons;
    }
    else {
      chrome.storage.local.set({reasons: true}, function () {});
      document.getElementById('Reasons').checked = true;
    }
  });

  document.getElementById('username').value = username;
  document.getElementById('pw').value = password;
};

var number_of_comments = 5;
var description_of_class = true;
var class_rating = true;
var username = "nope";
var password = "nope";


// The ID of the extension we want to talk to.
var editorExtensionId = chrome.runtime.id;

document.querySelector('#saving').addEventListener("click", function(){

  class_rating = document.getElementById('Course: Overall Ratings').checked;
  description_of_class = document.getElementById('description_of_class').checked;
  username = document.getElementById('username').value;
  password = document.getElementById('pw').value;
  number_of_comments = document.getElementById('comments').value;
  reasons = document.getElementById('Reasons').checked;
  //Grade distribution
  chrome.runtime.sendMessage(editorExtensionId, {username: username, password: password},
    function(response) {
      console.log("sending????");
      console.log(response);
      if (!response.success)
        handleError(url);
    });
  console.log(class_rating);
  chrome.storage.local.set({description_of_class: description_of_class}, function () {

    chrome.storage.local.get("description_of_class", function (value) {
      console.log(value); // 1
});
  });
  chrome.storage.local.set({ratings: class_rating}, function () {});
  chrome.storage.local.set({comments: number_of_comments}, function () {});
  chrome.storage.local.set({reasons: reasons}, function () {
    chrome.storage.local.get("reasons", function (value) {
      console.log(value); // 1
});

  });
  alert("Settings saved");
});

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

  chrome.storage.local.get('reasons', function (result) {
    console.log(result);
    if(result.reasons !== undefined)
    {
      document.getElementById('Reasons').checked = result.reasons;
    }
    else {
      chrome.storage.local.set({reasons: true}, function () {});
      document.getElementById('Reasons').checked = true;
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

  chrome.storage.local.get('description_of_class', function (result) {
    if(result.description_of_class !== undefined)
    {
      document.getElementById('description_of_class').checked = result.description_of_class;
    }
    else {
      chrome.storage.local.set({description_of_class: description_of_class}, function () {});
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
  document.getElementById('username').value = username;
  document.getElementById('pw').value = password;
};

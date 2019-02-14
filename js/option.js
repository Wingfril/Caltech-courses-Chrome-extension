var number_of_comments = 5;
var description_of_class = true;
var class_rating = true;
var username = "nope";
var password = "nope";


// The ID of the extension we want to talk to.
var editorExtensionId = "heidjakpbaicnhiacpmihjhocohniphf";

document.querySelector('#saving').addEventListener("click", function(){

  class_rating = document.getElementById('Course: Overall Ratings').checked;
  description_of_class = document.getElementById('description_of_class').checked;
  username = document.getElementById('username').value;
  password = document.getElementById('pw').value;
  number_of_comments = document.getElementById('comments').value;
  //Grade distribution
  chrome.runtime.sendMessage(editorExtensionId, {username: username, password: password},
    function(response) {
      console.log("sending????");
      console.log(response);
      if (!response.success)
        handleError(url);
    });

  chrome.storage.local.set({description_of_class: description_of_class}, function () {});
  chrome.storage.local.set({ratings: class_rating}, function () {});
  chrome.storage.local.set({comments: number_of_comments}, function () {});
});

window.onload = function() {
  chrome.storage.local.get('Cratings', function (result) {
    if(result.ratings !== undefined)
    {
      document.getElementById('Course: Overall Ratings').checked = result.ratings;
    }
    else {
      chrome.storage.local.set({Cratings: class_rating}, function () {});
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

var number_of_comments = 5;
var description_of_class = false;
var class_rating = false;
var username = "nope";
var password = "nope";
function toggle(toggled_type) {
  if (toggled_type === 'description')
  {
    description_of_class = !description_of_class;
  }
  if (toggled_type === 'class_rating')
  {
    class_rating = !class_rating;
  }
}
document.querySelector('#saving').addEventListener("click", function(){

  class_rating = document.getElementById('ratings').checked;
  description_of_class = document.getElementById('description_of_class').checked;
  username = document.getElementById('username').value;
  password = document.getElementById('pw').value;
  number_of_comments = document.getElementById('comments').value;

  chrome.storage.local.set({description_of_class: description_of_class}, function () {});
  chrome.storage.local.set({ratings: class_rating}, function () {});
  chrome.storage.local.set({comments: number_of_comments}, function () {});
});

function get_data(clas) {
  $.ajax({
    type: "GET",
    url: 'https://access.caltech.edu/home/home.s',
    success: function(data)
    {
      var lts = "null";
      if (data !== "")
      {
        parser = new DOMParser();
        doc = parser.parseFromString(data, "text/html");

      }
      if (doc.getElementById('lt') === null)
      {
        $.ajax({
          type: "POST",
          url: 'https://access.caltech.edu/tqfr/reports/search',
          data: {
            "search": "Bem 103"
          },
          success: function(data)
          {
            console.log(data);
          }
        });
      }
      else {
        var lts = doc.getElementById('lt').value;
        $.ajax({
          type: "POST",
          url: 'https://access.caltech.edu/auth/login_handler?came_from=https://access.caltech.edu/home/home.s&login_counter=0',
          data: {
            "login": login,
            "password":pw,
            "lt" :lts,
            "Sign In": "Sign In >"
          },
          success: function(data)
          {
            $.ajax({
              type: "POST",
              url: 'https://access.caltech.edu/tqfr/reports/search',
              data: {
                "search": "Bem 103"
              },
              success: function(data)
              {
                console.log(data);
              }
            });
          }
        });
      }
    }
  });
}

window.onload = function() {
  chrome.storage.local.get('ratings', function (result) {
    if(result.ratings !== undefined)
    {
      document.getElementById('ratings').checked = result.ratings;
    }
    else {
      chrome.storage.local.set({ratings: class_rating}, function () {});
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

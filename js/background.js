var username = "nope";
var password = "nope";

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.username !== null){
      username = request.username;
      password = request.password;
      sendResponse({farewell: "yay"});
    }
  });

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.class_name == "bem 103")
      console.log("woooo we did it guys");
      get_data(request.class_name);
      sendResponse({farewell: "goodbye"});
  });

chrome.omnibox.onInputEntered.addListener(function(data) {
  console.log(data);
  get_data(data);
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
        var doc = parser.parseFromString(data, "text/html");

      }
      if (doc.getElementById('lt') === null)
      {
        $.ajax({
          type: "POST",
          url: 'https://access.caltech.edu/tqfr/reports/search',
          data: {
            "search": clas
          },
          success: function(data_link)
          {
            doc = parser.parseFromString(data_link, "text/html");
            var link = "https://access.caltech.edu" + doc.getElementsByClassName("tablediv")[0].rows[1].cells[0].getElementsByTagName("a")[0].getAttribute("href");
            $.ajax({
              type: "GET",
              url: link,
              success: function(data_link_content)
              {
                return parse_data(data_link_content);
              }
            });

          }
        });
      }
      else {
        var lts = doc.getElementById('lt').value;
        console.log(username);
        //console.log(password);
        $.ajax({
          type: "POST",
          url: 'https://access.caltech.edu/auth/login_handler?came_from=https://access.caltech.edu/home/home.s&login_counter=0',
          data: {
            "login": username,
            "password":password,
            "lt" :lts,
            "Sign In": "Sign In >"
          },
          success: function(data)
          {
            $.ajax({
              type: "POST",
              url: 'https://access.caltech.edu/tqfr/reports/search',
              data: {
                "search": clas
              },
              success: function(data_link)
              {
                doc = parser.parseFromString(data_link, "text/html");
                console.log(doc);
                var link = "https://access.caltech.edu" + doc.getElementsByClassName("tablediv")[0].rows[1].cells[0].getElementsByTagName("a")[0].getAttribute("href");
                $.ajax({
                  type: "GET",
                  url: link,
                  success: function(data_link_content)
                  {
                    return parse_data(data_link_content);
                  }
                });
              }
            });
          }
        });
      }
    }
  });
}

function parse_data(data_link_content)
{
return get_comments(data_link_content).then(get_Cratings).then(get_Pratings).then(show_everything);
}

function get_comments(data_link_content)
{
  return new Promise(function(resolve, reject) {
    results = {}
    var number_of_comments = 5;
    var doc = parser.parseFromString(data_link_content, "text/html");
    chrome.storage.local.get('comments', function (result) {
      if(result.comments !== undefined)
      {
        number_of_comments = result.comments;
        if (number_of_comments > 0)
        {
          results['comments'] = [];
          var comment_table = doc.getElementsByClassName("tablediv comment-table");
          for (i = 0; i < number_of_comments; i++) {
            if (comment_table[0].rows.length <= i)
            {
              break;
            }
            results['comments'].push(comment_table[0].rows[i].cells[0].innerHTML);
          }
        }
      }
      //get_Cratings(doc, results)
    });
    resolve([doc, results]);
  });
}

function get_Cratings([doc, results])
{
  return new Promise(function(resolve, reject) {
    chrome.storage.local.get('Cratings', function (result) {
      if(result.Cratings !== undefined && result.Cratings === true)
      {
        results['class_rating'] = parse_table(doc.getElementsByClassName("survey_report"), "Overall Ratings","class_rating");
      }
    });
    resolve([doc, results]);
  });
}

function get_Pratings([doc, results])
{
  return new Promise(function(resolve, reject) {
    chrome.storage.local.get('Pratings', function (result) {
      if(result.Pratings !== undefined && result.Pratings === true)
      {
        results['prof_rating'] = parse_table(doc.getElementsByClassName("survey_report"), "Overall Ratings", "prof_rating");
      }
    });
    resolve([doc, results]);
  });
}

function parse_table(all_titles, table_name, needed_name)
{
  var correct_table;
  for (i = 0; i<all_titles.length; i++)
  {
    if (all_titles[i].innerHTML === table_name )
    {
      if (needed_name === "prof_rating")
      {
        needed_name = "";
      }
      else{
        correct_table = all_titles[i].nextSibling.nextElementSibling;
      }
    }
  }
  return correct_table;
}

function show_everything([doc, results])
{
    console.log(results);
}

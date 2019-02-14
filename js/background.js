var username = "";
var password = "";
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
    console.log("????");
  });

chrome.omnibox.onInputEntered.addListener(function(data) {
  console.log(data);
  var newURL = 'https://www.google.com/search?q=' + encodeURIComponent(data);
  chrome.tabs.create({ url: newURL });
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
            "search": "Bem 103"
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
                "search": "Bem 103"
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
        });
      }
    }
  });
}

function parse_data(data_link_content)
{
  results = {}
  var doc = parser.parseFromString(data_link_content, "text/html");
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

  if (class_rating)
  {
    results['class_rating'] = parse_table(doc.getElementsByClassName("survey_report"), "Overall Ratings");
  }
  console.log(results);
  //var comment_table = doc.getElementsByClassName("tablediv comment-table");
}

function parse_table(all_titles, table_name)
{
  var correct_table;
  for (i = 0; i<all_titles.length; i++)
  {

    if (all_titles[i].innerHTML === table_name)
    {
      correct_table = all_titles[i].nextSibling.nextElementSibling;
    }
  }
  return correct_table;
}

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
    if (request.class_name == "bem 103") {
      console.log("woooo we did it guys");

      isValidClass(request.class_name);

      sendResponse({farewell: "goodbye"});
    }
  });

// read from a text file by creating a new XMLHTTP Request
function isValidClass(clas) {
    file = "../other/all_classes.txt";

    let txt = '';
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        if (xmlhttp.status == 200 && xmlhttp.readyState == 4){
                txt = xmlhttp.responseText;
                data = txt.split("\n");

                parsed_data = [];
                // decompose things with a "/" into seperate elements
                for (var i = 0; i < data.length; ++i)
                {
                  if (data[i].includes("/")) {
                    arr = data[i].split(" ");
                    number = arr[1];
                    options = arr[0].split("/");
                    for (var j = 0; j < options.length; ++j) {
                      parsed_data.push(options[j].toLowerCase() + " " + number);
                    }
                  }
                  else {
                    parsed_data.push(data[i].toLowerCase());
                  }
                }
                console.log("Contents of file: " + parsed_data);
                console.log(parsed_data.includes(clas))
                if (parsed_data.includes(clas.toLowerCase())) {
                  console.log("do not worry child");
                  get_data(clas);
                }
                else {
                  console.log("Invalid class! You really suck man!")
                }
            }
    };
    xmlhttp.open("GET", file, true);
    xmlhttp.send();
    console.log("made it to the end of get text file");
}

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
            if(doc.title == "TQFR Reports: Search Results" &&
          doc.getElementsByClassName("tablediv")[0].rows[1]!= undefined)
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
          }
        });
      }
      else {
        var lts = doc.getElementById('lt').value;
        console.log(username);
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
                if(doc.title == "TQFR Reports: Search Results" &&
              doc.getElementsByClassName("tablediv")[0].rows[1]!= undefined)
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
return get_comments(data_link_content)
.then(get_Cratings).then(get_Pratings)
.then(get_title).then(get_Reasons)
.then(get_Grades).then(get_Hours)
.then(get_Work).then(get_Lectures)
.then(show_everything);
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
    });
    resolve([doc, results]);
  });
}

function get_title([doc, results])
{
  return new Promise(function(resolve, reject) {
    results['Class number'] = doc.getElementsByClassName("survey_title clearfix")[0].innerHTML;
    results['Class name'] = doc.getElementsByClassName("offering_title")[0].innerHTML;
    console.log(doc.getElementsByClassName("survey_title clearfix"));
    resolve([doc, results]);
  });
}

function get_Cratings([doc, results])
{
  return new Promise(function(resolve, reject) {
    chrome.storage.local.get('Cratings', function (result) {
      if(result.Cratings !== undefined && result.Cratings === true)
      {
        results['class_rating'] = parse_table(doc.getElementsByClassName("survey_report"), "Overall Ratings", "class_rating");
      }
    });
    resolve([doc, results]);
  });
}

function get_Grades([doc, results])
{
  return new Promise(function(resolve, reject) {
    chrome.storage.local.get('grades', function (result) {
      if(result.grades !== undefined && result.grades === true)
      {
        results['Grades'] = parse_table(doc.getElementsByClassName("survey_report"), "Expected Grade", "");
      }
    });
    resolve([doc, results]);
  });
}

function get_Lectures([doc, results])
{
  return new Promise(function(resolve, reject) {
    chrome.storage.local.get('lectures', function (result) {
      if(result.lectures !== undefined && result.lectures === true)
      {
        results['Lectures'] = parse_table(doc.getElementsByClassName("survey_report"), "% Of Lectures Attended", "");
      }
    });
    resolve([doc, results]);
  });
}

function get_Work([doc, results])
{
  return new Promise(function(resolve, reject) {
    chrome.storage.local.get('amount', function (result) {
      if(result.amount !== undefined && result.amount === true)
      {
        results['Amount'] = parse_table(doc.getElementsByClassName("survey_report"), "Was The Amount Of Work Required Higher Or Lower Than The Units Listed In The Catalog?", "");
      }
    });
    resolve([doc, results]);
  });
}

function get_Hours([doc, results])
{
  return new Promise(function(resolve, reject) {
    chrome.storage.local.get('hours', function (result) {
      if(result.hours !== undefined && result.hours === true)
      {
        results['Hours'] = parse_table(doc.getElementsByClassName("survey_report"), "Hours/Week Spent On Coursework Outside Of Class", "");
      }
    });
    resolve([doc, results]);
  });
}


function get_Reasons([doc, results])
{
  return new Promise(function(resolve, reject) {
    chrome.storage.local.get('reasons', function (result) {
      if(result.reasons !== undefined && result.reasons === true)
      {
        results['Reasons'] = parse_table(doc.getElementsByClassName("survey_report"), "Reason For Taking Course", "");
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
    console.log("you've managed not to mess anything up, congrats!")
}

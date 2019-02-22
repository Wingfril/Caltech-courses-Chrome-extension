chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    //if (request.method == "getSelection")
      //sendResponse({data: window.getSelection().toString()});
    //else
      //sendResponse({}); // snub them.
});

function isTextSelected() {
        var clas = window.getSelection().toString();
        console.log(clas);

        // eventually check if the string is a valid class before passing it

        clas = "bem 103";

        chrome.runtime.sendMessage({class_name: clas}, function(response) {
  		console.log(response.farewell);
});
}

document.addEventListener("mouseup", isTextSelected);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    //if (request.method == "getSelection")
      //sendResponse({data: window.getSelection().toString()});
    //else
      //sendResponse({}); // snub them.
});

function isTextSelected() {
        var myText = window.getSelection().toString();
        console.log(myText);
}

document.addEventListener("mouseup", isTextSelected);

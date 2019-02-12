window.onload = function() {
  console.log("readfy");
  document.querySelector('#go-to-options').addEventListener("click", function() {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
      console.log("option1");
    } else {
      window.open(chrome.runtime.getURL('../options.html'));
      console.log("option2");
    }
  });

  chrome.tabs.executeScript( {
      code: "window.getSelection().toString();"
  }, function(selection) {
      console.log(selection);
  });
}

console.log("AHHH");

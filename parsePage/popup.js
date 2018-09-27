chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource") {
    message.innerText = request.source;
  }
});

function onWindowLoad() {
  var message = document.querySelector('#message');
  console.log('onWindowLoad');

  chrome.tabs.executeScript(null, {
    file: "getPagesSource.js"
  }, function() {
    // If you try and inject into an extensions page or the webstore/NTP you'll get an error
    if (chrome.runtime.lastError) {
      message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
    }

    let promise = strip(message);
    promise.then(() => {
        console.log('in then');
        var sheCount = (message.innerHTML.match(/she/g) || []).length;
        var heCount = (message.innerHTML.match(/he/g) || []).length;
        console.log('sheCount: ' + sheCount);
        console.log('heCount: ' + heCount);
    })

});

}

window.onload = onWindowLoad;



function strip(html) {
    return new Promise(function(resolve, reject) {
    // var tmp = document.implementation.createHTMLDocument("New").body;
    // tmp.innerHTML = html;
    // resolve(tmp.textContent || tmp.innerText || "");
    resolve(html);
    })
}

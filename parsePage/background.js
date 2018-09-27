/**
 * Get the HTML source for the main frame of a given tab.
 *
 * @param {integer} tabId - ID of tab.
 * @param {function} callback - Called with the tab's source upon completion.
 * mostly from https://stackoverflow.com/questions/11684454/getting-the-source-html-of-the-current-page-from-chrome-extension
 */
function getSourceFromTab(tabId, callback) {
    // Capture the page when it has fully loaded.
    // When we know the tab, execute the content script
    chrome.tabs.onUpdated.addListener(onUpdated);
    chrome.tabs.onRemoved.addListener(onRemoved);
    function onUpdated(updatedTabId, details) {
        if (details.status == 'complete') {
            removeListeners();
            chrome.tabs.executeScript(tabId, {
                file: 'get_source.js'
            }, function(results) {
                // TODO: Detect injection error using chrome.runtime.lastError

                var source = results[0];
                done(source);
            });
        }
    }
    function removeListeners() {
        chrome.tabs.onUpdated.removeListener(onUpdated);
        chrome.tabs.onRemoved.removeListener(onRemoved);
    }

    function onRemoved() {
        removeListeners();
        callback(''); // Tab closed, no response.
    }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.highlight === true) {
    sendResponse({messageStatus: "received"});
  }
});

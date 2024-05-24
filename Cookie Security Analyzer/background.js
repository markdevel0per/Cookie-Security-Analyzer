function storeCookies(cookies) {
  chrome.storage.local.set({ cookies: cookies }, function() {
    if (chrome.runtime.lastError) {
      console.error("Error storing cookies in storage:", chrome.runtime.lastError.message);
    } 
  });
}


function storeUrl(url) {
  chrome.storage.local.set({ url: url }, function() {
    if (chrome.runtime.lastError) {
      console.error("Error storing url in storage:", chrome.runtime.lastError.message);
    } 
  });
}


function handleNavigationCompleted(details) {
  if (details.frameId === 0) {
    chrome.cookies.getAll({ url: details.url }, function(allCookies) {
      if (allCookies && allCookies.length > 0) {
        storeCookies(allCookies);
        storeUrl(details.url);
      }
    });
  }
}


chrome.webNavigation.onCompleted.addListener(handleNavigationCompleted);

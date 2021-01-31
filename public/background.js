let userSignedIn = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "set_user") {
    console.log("set_user has been invoked !");
    userSignedIn = request.payload;
    sendResponse({
      message: 204,
    });
  } else if (request.message === "get_user") {
    console.log("get_user has been invoked !");
    sendResponse({
      message: 200,
      payload: userSignedIn,
    });
  } else if (request.message === "screenshot") {
    console.log("screeeenshot");
    // chrome.permissions.request({ origins: ["<all_urls>"] });
    chrome.tabs.captureVisibleTab((screenshotUrl) => {
      console.log({ screenshotUrl });
      // return sendResponse({
      //   message: 200,
      //   payload: screenshotUrl,
      // });
      const viewTabUrl = chrome.extension.getURL("screenshot.html?id=0");
      let targetId = null;
      chrome.tabs.onUpdated.addListener(function listener(tabId, changedProps) {
        if (tabId != targetId || changedProps.status != "complete") return;
        chrome.tabs.onUpdated.removeListener(listener);
        const views = chrome.extension.getViews();
        for (let i = 0; i < views.length; i++) {
          let view = views[i];
          if (view.location.href == viewTabUrl) {
            view.setScreenshotUrl(screenshotUrl);
            break;
          }
        }
      });
      chrome.tabs.create({ url: viewTabUrl }, (tab) => {
        targetId = tab.id;
      });
    });
  }
});

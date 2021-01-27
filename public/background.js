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
  }
});

let isExtensionOn = false;

chrome.action.onClicked.addListener((tab) => {
  isExtensionOn = !isExtensionOn;
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      message: isExtensionOn ? "turned_on" : "turned_off",
    });
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "turned_off") {
    let markedElements = document.getElementsByTagName("mark");
    while (markedElements[0]) {
      let parent = markedElements[0].parentNode;
      while (markedElements[0].firstChild) {
        parent.insertBefore(markedElements[0].firstChild, markedElements[0]);
      }
      parent.removeChild(markedElements[0]);
    }
  }
});

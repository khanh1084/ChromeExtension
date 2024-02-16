function searchForDatabase() {
  chrome.storage.sync.get("database", function (results) {
    if (objDoesNotExist(results)) {
      createDatabaseObj();
    } else {
      applyHighlight(results.database);
    }
  });
}

function objDoesNotExist(results) {
  return results === undefined || Object.keys(results).length === 0;
}

function createDatabaseObj() {
  database = {};
  chrome.storage.sync.set({ database: database }, function () {});
}

function applyHighlight(database) {
  for (var id in database) {
    let markedText = `<mark title="${database[id]}">${id}</mark>`;
    document.body.innerHTML = document.body.innerHTML.replace(
      new RegExp(
        `(?<!value="\\w*)(?<!;\\w*)(?<!data-ved="\\w*)(${id})(?!\\w*</textarea>)`,
        "g"
      ),
      markedText
    );
    console.log("Highlight applied.");
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "turned_on") {
    searchForDatabase();
  }
});

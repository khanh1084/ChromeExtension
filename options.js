document.getElementById("addForm").addEventListener("submit", function (event) {
  event.preventDefault();
  let id = document.getElementById("id").value;
  let device = document.getElementById("device").value;
  chrome.storage.sync.get(["database"], function (result) {
    let database = result.database || {};
    database[id] = device;
    chrome.storage.sync.set({ database: database }, function () {
      alert("Added successfully!");
      document.getElementById("id").value = "";
      document.getElementById("device").value = "";
      location.reload();
    });
  });
});

document.getElementById("clear").addEventListener("click", function () {
  chrome.storage.sync.clear(function () {
    alert("Database cleared!");
    location.reload();
  });
});

document
  .getElementById("jsonFile")
  .addEventListener("change", function (event) {
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.onload = function (event) {
      let newData = JSON.parse(event.target.result);
      chrome.storage.sync.get("database", function (result) {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          return;
        }

        let database = result.database || {};
        for (let id in newData) {
          database[id] = newData[id];
        }

        chrome.storage.sync.set({ database: database }, function () {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            return;
          }
          alert("Database updated!");
          location.reload();
        });
      });
    };
    reader.readAsText(file);
  });

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

// function applyHighlight(database) {
//   let walker = document.createTreeWalker(
//     document.body,
//     NodeFilter.SHOW_TEXT,
//     null,
//     false
//   );

//   let node;
//   let nodesToReplace = [];
//   while ((node = walker.nextNode())) {
//     for (var id in database) {
//       let markedText = `<mark title="${database[id]}">${id}</mark>`;
//       let re = new RegExp(`(${id})`, "g");
//       if (re.test(node.nodeValue)) {
//         let newNode = document.createElement("mark");
//         newNode.setAttribute("title", `${database[id]}`);
//         newNode.innerHTML = node.nodeValue.replace(re, markedText);
//         nodesToReplace.push({ oldNode: node, newNode: newNode });
//       }
//     }
//   }

//   for (let i = 0; i < nodesToReplace.length; i++) {
//     let oldNode = nodesToReplace[i].oldNode;
//     let newNode = nodesToReplace[i].newNode;
//     oldNode.parentNode.insertBefore(newNode, oldNode);
//     oldNode.parentNode.removeChild(oldNode);
//     console.log("Highlight applied.");
//   }
// }

function walkTreeAndHighlight(node, database) {
  if (node.nodeName === "NOSCRIPT") {
    return;
  }
  if (
    node.nodeType === Node.TEXT_NODE &&
    node.parentNode.nodeName !== "SCRIPT" &&
    node.parentNode.nodeName !== "STYLE" &&
    node.parentNode.nodeName !== "META" &&
    node.parentNode.nodeName !== "TEXTAREA"
  ) {
    for (var id in database) {
      let re = new RegExp(`(?<!content="\\w*)(${id})`, "g");
      if (re.test(node.nodeValue)) {
        let markedText = `<mark title="${database[id]}">${id}</mark>`;
        let parentNode = node.parentNode;
        let newNode = document.createElement("span");
        newNode.innerHTML = node.nodeValue.replace(re, markedText);
        parentNode.replaceChild(newNode, node);
        console.log("Highlight applied.");
      }
    }
  } else {
    for (let i = 0; i < node.childNodes.length; i++) {
      walkTreeAndHighlight(node.childNodes[i], database);
    }
  }
}

function applyHighlight(database) {
  walkTreeAndHighlight(document.body, database);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "turned_on") {
    searchForDatabase();
  }
});

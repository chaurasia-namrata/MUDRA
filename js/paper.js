const clientId = "enter_client_code_here";

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.storage.sync.get(['token'], function(res) {
    var authToken = res.token;
    if (!authToken) {
      authorise();
    }
  });
});

var contextMenuItem = {
  "id": "sendText",
  "title": "Send Text to Paper",
  "contexts": ["selection"]
}

var childContextMenuItem = {
  "id": "newPaper",
  "parentId": "sendText",
  "title": "Create New Paper",
  "contexts": ["selection"]
}

chrome.contextMenus.create(contextMenuItem);
chrome.contextMenus.create(childContextMenuItem);

chrome.storage.sync.get(['token'], function(res) {
  var authToken = res.token;
  if (!authToken) {
    chrome.browserAction.setBadgeText({ text: '!' });
    chrome.browserAction.setBadgeBackgroundColor({ color: "red" });
    chrome.browserAction.setTitle({ title: 'Please Sign-In' });
    chrome.contextMenus.update('sendText', { visible: false });
  }
});

chrome.storage.onChanged.addListener(function(changes, areaName) {
  chrome.storage.sync.get(['token'], function(res) {
    var authToken = res.token;
    if (!authToken) {
      chrome.browserAction.setBadgeText({ text: '!' });
      chrome.browserAction.setBadgeBackgroundColor({ color: "red" });
      chrome.browserAction.setTitle({ title: 'Please Sign-In' });
      chrome.contextMenus.update('sendText', { visible: false });
    }
    else {
      chrome.contextMenus.update('sendText', { visible: true });
      chrome.browserAction.setBadgeText({ text:'' });
      chrome.browserAction.setTitle({ title: '' });
    }
  });
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  var pageUrl = info.pageUrl;
  var tabTitle = tab.title;
  var selectedText = info.selectionText;
  chrome.storage.sync.get(['token'], function(res) {
    var authToken = res.token;
    if (authToken) {
      if (info.menuItemId == "newPaper") {
        createPaper(authToken, selectedText, tabTitle, pageUrl);
      }
      else {
        var paperId = info.menuItemId;
        getCurrentRevision(authToken, paperId, selectedText, tabTitle, pageUrl);
      }
    }
    else {
      window.alert('Oops! Looks like you have not authorised paper-extension yet. Sign in to dropbox by clicking paper-extension icon.');
    }
  });
});

function authorise() {
  var dropboxURL = "https://www.dropbox.com/oauth2/authorize?response_type=token&client_id=" + clientId + "&redirect_uri=https://wdlsvnit.github.io/paper-extension/"
  chrome.tabs.create({ url: dropboxURL });
}

function createPaper(token, text, tabTitle, pageUrl) {
  //Send request to create paper and Store paper revision with respective paper_id
  var url = 'https://api.dropboxapi.com/2/paper/docs/create';
  var xhr = new XMLHttpRequest();

  xhr.open("POST", url ,true);

  xhr.setRequestHeader("Authorization", "Bearer " + token);
  xhr.setRequestHeader("Dropbox-API-Arg", "{\"import_format\": \"markdown\"}");
  xhr.setRequestHeader("Content-Type", "application/octet-stream");

  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
      var paper = JSON.parse(this.response);
      saveToPaper(token, paper.doc_id, text, tabTitle, pageUrl, paper.revision);

      //add context menu option for new paper
      var doc =  {
        "id": paper.doc_id,
        "parentId": "sendText",
        "title": paper.title,
        "contexts": ["selection"]
      };
      chrome.contextMenus.create(doc);
      chrome.storage.sync.get(['papers'], function(res) {
        res.papers.push(paper.doc_id);
        chrome.storage.sync.set({ 'papers': res.papers});
      });
    }
  };
  var title = window.prompt('Enter title for the paper: ', 'Paper-extension');
  xhr.send(title);
}

function getCurrentRevision(token, paperId, text, tabTitle, pageUrl) {
  var metaDataUrl = 'https://api.dropboxapi.com/2/paper/docs/get_metadata';
  var metaDataXhr = new XMLHttpRequest();
  metaDataXhr.open("POST", metaDataUrl, true);

  metaDataXhr.setRequestHeader("Authorization", "Bearer " + token);
  metaDataXhr.setRequestHeader("Content-Type", "application/json");

  metaDataXhr.onreadystatechange = function() {
    if(metaDataXhr.readyState == XMLHttpRequest.DONE && metaDataXhr.status == 200) {
      var result = JSON.parse(metaDataXhr.responseText);
      saveToPaper(token, paperId, text, tabTitle, pageUrl, result.revision);
    } 
  }
  metaDataXhr.send(JSON.stringify({
    "doc_id": paperId
  }));
}

function saveToPaper(token, paperId, text, tabTitle, pageUrl, currentRev) {
  //Send request to update paper and Update paper revision with new revision
  var url = 'https://api.dropboxapi.com/2/paper/docs/update';
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);

  xhr.setRequestHeader("Authorization", "Bearer " + token);
  xhr.setRequestHeader("Dropbox-API-Arg", "{\"doc_id\": \"" + paperId + "\",\"doc_update_policy\": \"append\",\"revision\": " + currentRev + ",\"import_format\": \"markdown\"}");
  xhr.setRequestHeader("Content-Type", "application/octet-stream");

  var today = new Date();
  var date = today.toDateString();
  var hour = today.getHours()
  var suffix =  (hour < 12 || hour === 24) ? " AM" : " PM";
  var time = (hour % 12 || 12) + ":" + today.getMinutes() + ":" + today.getSeconds() + suffix;
  var dateTime = date + ' ' + time;
  xhr.send("-\n## " + tabTitle + " [↗](" + pageUrl + ")" + "\n" + text + "\n" + dateTime + ". ");
}

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  chrome.storage.sync.get(['papers'], function(res) {
    var allDocs = request.docs.docs;
    for (var entry of allDocs) {
      if (res.papers.indexOf(entry.doc_id) === -1) {
        var doc =  {
          "id": entry.doc_id,
          "parentId": "sendText",
          "title": entry.title,
          "contexts": ["selection"]
        };
        chrome.contextMenus.create(doc);
        res.papers.push(entry.doc_id);
        chrome.storage.sync.set({ 'papers': res.papers});
      }
    }

    if (res.papers.length > allDocs.length) {
      var docIdArray = allDocs.map(function(doc) {
        return doc.doc_id;
      });
      for (var paper of res.papers) {
        if (docIdArray.indexOf(paper) === -1) {
          chrome.contextMenus.remove(paper);
        }
      }
    }
  });
});

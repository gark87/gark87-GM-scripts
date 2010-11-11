// ==UserScript==
// @name           JiraAssigner
// @namespace      http://gark-87.livejournal.com
// @description    Makes assigning issues in JIRA easier
// @include        *jira*/secure/*AssignIssue!default.jspa*
// ==/UserScript==

var users = ['zarubin', 'belom', 'rkaterinenko', 'kirillov', 'lukashevich'];

// <a> Assign to me link
var all = document.evaluate(
          "//a[@title='Assign this issue to me']",
          document,
          null,
          XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
          null);

// no such link - do nothing
if (all.snapshotLength == 0)
  return;

var a = all.snapshotItem(0);
for(var j = 0; j < users.length; j++) {
  var new_user = document.createElement('a');
  new_user.setAttribute('onclick', 'document.getElementById("assignee").value = "' + users[j] + '";return false;');
  new_user.setAttribute('href', '#');
  new_user.innerHTML = users[j];
  a.parentNode.insertBefore(new_user, a);
  var div = document.createElement('div');
  new_user.parentNode.insertBefore(div, new_user);
}

var div = document.createElement('div');
a.parentNode.insertBefore(div, a);

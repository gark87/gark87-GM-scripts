// ==UserScript==
// @name           JiraAssigner
// @namespace      http://gark-87.livejournal.com
// @description    Makes assigning issues in JIRA easier
// @include        *jira*/secure/*AssignIssue!default.jspa*
// ==/UserScript==

function getUsers(props, title) {
  if (title == 'Send to review' && props[0].indexOf('TC-') != -1)
    return ['zarubin', 'belom', 'rkaterinenko', 'lukashevich'];
  return ['zarubin', 'belom', 'rkaterinenko', 'kirillov'];
}

// trim and no tags
function my_trim(str) {
  return str.replace(/<[^>]*>/g, '').   // no tags
             replace(/^\s\s*/, '').     // trim
	     replace(/\s\s*$/, '');     // trim
}

// looking for a XPath
function lookup(str) {
  return document.evaluate(str,
	  document,
	  null,
          XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
	  null);
}

// <a> Assign to me link
var all = lookup("//a[@title='Assign this issue to me']");

// no such link - do nothing
if (all.snapshotLength == 0)
  return;

var title = lookup("//h3[@class='formtitle']").snapshotItem(0).innerHTML;
title = title.replace(/^\s+/, '').replace(/\s+$/, '');

// issue details
var issuedetails = lookup("//table[@id='issuedetails']");
var details = issuedetails.snapshotItem(0).rows;

// init issue details
var props = new Array();
for (var j = 0; j < details.length; j++) {
  var detail = details[j];
  var value = my_trim(detail.cells[1].innerHTML);
  props[j] = value;
}

var a = all.snapshotItem(0);

var users = getUsers(props, title);
document.getElementById("assignee").value = users[0];
for(var j = 0; j < users.length; j++) {
  var new_user = document.createElement('a');
  new_user.setAttribute('onclick', "document.getElementById('assignee').value = '" + users[j] + "'; return false;");
  new_user.setAttribute('href', '#');
  new_user.innerHTML = users[j];
  a.parentNode.insertBefore(new_user, a);
  var div = document.createElement('div');
  new_user.parentNode.insertBefore(div, new_user);
}

var div = document.createElement('div');
a.parentNode.insertBefore(div, a);

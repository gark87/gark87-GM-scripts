// ==UserScript==
// @name           JIRA process checker
// @namespace      http://gark_87.livejournal.com
// @description    Devexperts TosChart process helper
// @include        *jira.in.devexperts.com/browse/TC-*
// @version        0.0.1
// ==/UserScript==

// trim and no tags
function my_trim(str) {
  return str.replace(/<[^>]*>/g, '').   // no tags
             replace(/^\s\s*/, '').     // trim
	     replace(/\s\s*$/, '');     // trim
}

// add's process warning/error
function warning(condition, text, error) {
  if (!condition)
    return; // do not have any problem
  var child = document.createElement('font');
  child.setAttribute('color', error ? "red" : "maroon"); // red is contrast 
  child.setAttribute('size', error ? "5" : "2");         // make it big
  child.innerHTML = text;                                // problem desc
  document.body.insertBefore(child, document.body.childNodes[0]);
}

// looking for a XPath
function lookup(str) {
  return document.evaluate(str,
	  document,
	  null,
          XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
	  null);
}

// TC branch number(`about:config' could help you to change it)
var branch = parseInt(GM_getValue("branch_version"));

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

// affects versions
var affects = lookup('//b[contains(., "Affects Version/s:")]/../..').
        snapshotItem(0).cells[1].innerHTML.split(',');

// new or old issue(if new - it should be an error, 
// otherwise - just warning).
var newIssue = true;
for(var j = 0; j < affects.length; j++)
  newIssue &= parseInt(my_trim(affects[j])) >= branch;

// process
warning(props[1] == 'Defect Report' && 
  lookup('//i[contains(., "introduced by")]').snapshotLength == 0,
  "`Defect Report` without 'introduced by'", newIssue);

warning(props[1] == 'Change Request' && 
  lookup('//b[contains(., "TOS Requirements*")]').snapshotLength == 0,
  "`Change Request` without TOSREQ", newIssue);

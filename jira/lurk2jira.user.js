// ==UserScript==
// @name           Lurk2JIRA
// @namespace      http://gark-87.livejournal.com
// @description    Lurk plashka-s on my JIRA
// @include        https://jira.in.devexperts.com/browse/*-*
// @version        0.0.1
// ==/UserScript==

// trim and no tags
function my_trim(str) {
  return str.replace(/<[^>]*>/g, '').   // no tags
             replace(/^\s\s*/, '').     // trim
	     replace(/\s\s*$/, '');     // trim
}

// add's process warning/error
function warning(condition, text, image, a) {
  if (!condition)
    return; // do not have any problem
  var child = document.createElement('table');

  child.innerHTML = "<tr><td width='72px' height='24'> <img src='" + image +"' width='64' height='64' border='0' /> </td> <td style='vertical-align: middle'>"+text+" </td> </tr> ";
  child.setAttribute('style', 'clear: both;width: 100%; '
+'background-color: #fefefe; border-color:#AAB #AAB #AAB #999; border-style: solid; border-width: 1px 1px 1px 10px; padding: 4px; margin: 1px auto; vertical-align: middle; text-align: left;');
  child.setAttribute('cellpading', '0');
  child.setAttribute('cellspacing', '0');
  a.parentNode.insertBefore(child, a);
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

var menu = lookup("//table[@id='issue_header']").snapshotItem(0);

var creationDate = lookup("//span[@class='date']").snapshotItem(0).innerHTML.replace(/^.*\/([0-9]*).*$/ , "$1");
// process
warning(parseInt(creationDate) < 10, '<b><span style="font-family: \'Lucida Console\',Tahoma,Georgia,sans-serif;">A long time ago, in a galaxy far, far away...</span></b><br><span style="font-family: \'Lucida Console\',Tahoma,Georgia,sans-serif;">События и явления, описанные в этой статье, были давно, и помнит о них разве что пара-другая олдфагов. Но Анонимус не забывает!</span>', 'http://lurkmore.ru/images/c/cf/Wrar64.png', menu);

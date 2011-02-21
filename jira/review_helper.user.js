// ==UserScript==
// @name           Review Helper
// @namespace      http://gark_87.livejournal.com
// @description    Helps with review shows all changes grouped not by commits but by files
// @include        *jira*/browse/*
// ==/UserScript==

// constants
var COMMITS_ID  = 'gark87-review-commits';
var NEW_ID      = 'gark87-review-new';
var REVIEW_MODE = '[Review Mode]';
var USUAL_MODE  = '[Usual Mode]';

// new link creator
function create_link(file, from, to) {
  return  '(<a href="' + file + 
	  "?r1=" + from + 
	  "&r2=" + to + 
	  '&diff_format=l">' +
	  from + " - " + to +
	  "</a>)  ";
}

// This function sorts objects by key
function sortObj(arr){
  // Setup Arrays
  var sortedKeys = new Array();
  var sortedObj = {};

  // Separate keys and sort them
  for (var i in arr)
    sortedKeys.push(i);
  sortedKeys.sort();

  // Reconstruct sorted obj based on keys
  for (var i in sortedKeys) 
    sortedObj[sortedKeys[i]] = arr[sortedKeys[i]];
  return sortedObj;
}

// process all changes to group by files
var diff_files = document.evaluate(
         "//a[contains(@href, 'diff_format')]",
          document,
          null,
          XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
          null);

var files2vers = {};
for (var i = 0; i < diff_files.snapshotLength; i++) {
  var a = diff_files.snapshotItem(i);
  var href = a.href.toString();
  var match = /^([^?]*)\?r1=([^&]*)&r2=([^&]*)/.exec(href);
  var file = match[1];
  var r1 = match[2];
  var r2 = match[3];
  if (files2vers[file] == undefined)
    files2vers[file] = {};
  files2vers[file][r2] = r1;
}

var div = document.createElement('div');
div.style.display = 'none';
div.setAttribute('id', NEW_ID);
for (file in sortObj(files2vers)) {
  var innerDiv = document.createElement('div');
  var a = document.createElement('a');
  a.style.background = "#99ff99";
  a.innerHTML += file.replace(/^.*viewcvs\//, '');
  a.href = file;
  innerDiv.insertBefore(a, innerDiv.firstChild);
  var end_version = -1;
  var start_version = -1;
  var vers = sortObj(files2vers[file]);
  for (ver in vers) {
    if (start_version == -1) {
      start_version = ver;
      end_version = vers[ver];
    } 
    else if (end_version == ver)
      end_version = vers[ver];
    else if (start_version == vers[ver])
      start_version = ver;
    else {
      innerDiv.innerHTML += create_link(file, start_version, end_version);
      start_version = -1;
      end_version = -1;
    }
  }
  if (start_version != -1)
    innerDiv.innerHTML += create_link(file, start_version, end_version);
  innerDiv.innerHTML += "<br />";
  div.insertBefore(innerDiv, div.firstChild); 
}

var parent = document.getElementById("issue_actions_container");
parent.insertBefore(div, parent.firstChild); 

var user_commits = document.evaluate(
            "//td/font[@size='-1']",
	    document,
	    null,
            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
            null);
for (var i = 0; i < user_commits.snapshotLength; i++) {
  var table = user_commits.snapshotItem(i).
      parentNode.parentNode.parentNode.parentNode;
  table.id = COMMITS_ID + i;
  var br = table.nextSibling;
  while(br != undefined && 
      (br.tagName == undefined || br.tagName == "BR")) 
  {
    var next = br.nextSibling;
    br.parentNode.removeChild(br);
    br = next;
  }
}

// add button to switching
var ddiv= document.createElement('div');
var button = document.createElement('a');
parent.insertBefore(ddiv, parent.firstChild);
ddiv.insertBefore(document.createElement('br'), ddiv.firstChild);
ddiv.insertBefore(document.createElement('br'), ddiv.firstChild);
ddiv.insertBefore(button, ddiv.firstChild);
button.innerHTML = REVIEW_MODE;
button.style.color = "#ffffff";
button.style.background = "#000000";
button.style.fontSize = 20;
button.setAttribute('onClick',
    'var old_, new_, this_;' +
    'if (this.innerHTML == "' + REVIEW_MODE + '") {' +
    '  old_ = "none";' +
    '  new_ = "";' +
    '  this_ = "' + USUAL_MODE +'";' +
    '} else {' +
    '  old_ = "";' +
    '  new_ = "none";' +
    '  this_ = "' + REVIEW_MODE +'";' +
    '}' +
    'this.innerHTML = this_;' +
    'document.getElementById("' + NEW_ID +'").style.display = new_;' +
    'var olds = document.evaluate("//table[contains(@id, \'' + 
           COMMITS_ID +'\')]",' +
    '    document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);' +
    'for (var i = 0; i < olds.snapshotLength; i++) {' +
    '  olds.snapshotItem(i).style.display = old_;' +
    '}'
);

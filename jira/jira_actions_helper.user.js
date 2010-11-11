// ==UserScript==
// @name           Jira Actions Helper
// @namespace      http://gark_87.livejournal.com
// @description    helps with issue review
// @include        *jira*/browse/*-*
// @version        0.0.1
// ==/UserScript==

// constants
function foldForTable(element, id, foldByDefault) {
  var fold   = '[-]';
  var unfold = '[+]';

  // button to fold/unfold
  var button = document.createElement('a');
  button.setAttribute('style', 'font-family: monospace;');
  button.innerHTML = (foldByDefault) ? unfold : fold;
  if (foldByDefault) {
    for(var i = 1; i < table.rows.length; i++)
      table.rows[i].setAttribute("style", "display:none;");
  }

  // code to fold/unfold
  button.setAttribute('onClick', 
         'if (this.innerHTML == "' + fold + '") {' +
           'this.innerHTML = "' + unfold + '";' +
           'var table = document.getElementById("' + id + '");' + 
	   'for(var i = 1; i < table.rows.length; i++) { '+
	   '  table.rows[i].setAttribute("style", "display:none;");' +
	   '}' +
         '} else {'+
           'this.innerHTML = "' + fold + '";' +
           'var table = document.getElementById("' + id + '");' + 
	   'for(var i = 1; i < table.rows.length; i++) { '+
	   '  table.rows[i].setAttribute("style", "display:table-row;");' +
	   '}' +
         '}');
    
  // insert <a> button
  var cell = element.rows[0].cells[0];
  cell.insertBefore(button, cell.firstChild);
}

var actions = document.evaluate(
          "//div[@class='actionContainer']",
          document,
          null,
          XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
          null);

for (var i = 0; i < actions.snapshotLength; i++) {
  var action = actions.snapshotItem(i);
}

var tables = document.evaluate(
          "//table[contains(@id, 'changehistory_')]",
          document,
          null,
          XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
          null);

for (var i = 0; i < tables.snapshotLength; i++) {
  var table = tables.snapshotItem(i);
  foldForTable(table, table.getAttribute('id'), true);
}


// ==UserScript==
// @name           Polarion diff highlighter
// @namespace      http://gark_87.livejournal.com
// @description    diff for changes made in Polarion
// @include        *polarion*
// @require        http://github.com/gark87/gark87-GM-scripts/raw/master/polarion/difflib.js
// @require        http://github.com/gark87/gark87-GM-scripts/raw/master/polarion/diffview.js
// @resource       css http://github.com/gark87/gark87-GM-scripts/raw/master/polarion/diffview.css
// @version        0.0.1
// ==/UserScript==

// add CSS
var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = GM_getResourceText('css');
document.getElementsByTagName('head')[0].appendChild(style);

// add eventlistener because of AJAX
document.addEventListener("DOMNodeInserted",
function(evt) {
  // another event
  if(evt.target.rows == undefined || 
     evt.target.rows[0].cells[0].innerHTML != 'Field')
  {
    return;
  }
  // process event
  process(evt.target);
}, true);

// remove tags
function trim(src) {
  var str = (src.innerHTML);
  str = str.replace(/[\r\n]+/g, '');
  str = str.replace(/ *<br[^>]*> */g, '\n');
  str = str.replace(/ *<\/p> */g, '\n');
  str = str.replace(/ *<[^>]+> */g, '');
  return str;
}

// insert diff
function process(table) {
  for(var index = 1; index < table.rows.length; index++) {
    var cells = table.rows[index].cells;
    if (cells.length >= 3) {
      var base = difflib.stringAsLines(trim(cells[1]));
      var newtxt = difflib.stringAsLines(trim(cells[2]));
      var sm = new difflib.SequenceMatcher(base, newtxt);
      var opcodes = sm.get_opcodes(); 
      var contextSize = 30;
      var diff = diffview.buildView({ 
            baseTextLines:base, 
	    newTextLines:newtxt, 
	    opcodes:opcodes,
            contextSize:contextSize, 
	    viewType: 0
      });
      var td = document.createElement('td');
      td.appendChild(diff);
      table.rows[index].replaceChild(td, cells[1]);
    }
  }
}


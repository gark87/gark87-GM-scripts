// ==UserScript==
// @name           Polarion links helper
// @namespace      http://gark_87.livejournal.com
// @description    links become real links in Polarion
// @include        *polarion*
// @version        0.0.1
// ==/UserScript==

// add eventlistener because of AJAX
document.addEventListener("DOMNodeInserted",
function(evt) {
  var t = evt.target;
  // another event
  if(t.innerHTML == undefined || t.innerHTML.indexOf('://') == -1)
    return;
  // process event
  process(t);
}, true);

// make links - real links
function process(e) {
   e.innerHTML = e.innerHTML.replace(/([a-zA-Z]+:)\/\/([^<> ]+)([^<>]*<)/g,
       '<a href="$1//$2">$1\\\\$2</a>$3');
}


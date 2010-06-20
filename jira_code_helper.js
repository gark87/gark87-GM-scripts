// ==UserScript==
// @name           Jira {code} Helper
// @namespace      http://gark_87.livejournal.com
// @include        *jira*/browse/*-*
// @version        0.0.1
// ==/UserScript==

// this is about changing `   ' -> ` &nbsp;&nbsp;'
// (N+1) blanks to 1 ` ' + N `&nbsp;'
function keepBlanks(str) {
  return str.replace(/( {2,})/g, function(regex, group) {
          var result = ' ';
          for(var i = 0; i < group.length - 1; i++)
            result += '&nbsp;';
          return result;
      });
}

var allCode;
allCode = document.evaluate(
        "//pre[@class='code-java']",
	document,
	null,
	XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
	null);

for (var i = 0; i < allCode.snapshotLength; i++) {
      var thisCode = allCode.snapshotItem(i);
      var span = document.createElement('span');
      span.setAttribute('style', 'font-family: monospace;');
      var lines = thisCode.innerHTML.split(/[\r\n]/);
      for(var j = 0; j < lines.length; j++) {
	var line = lines[j];
	var len = line.length;
	var result = '';
	var nonBlank = 0;
	for(; nonBlank < len && line.charAt(nonBlank) == ' '; nonBlank++)
	  result += '&nbsp;';
	span.innerHTML += result + 
	  keepBlanks(line.substring(nonBlank, len)) + '<br/>';
      }
      thisCode.parentNode.insertBefore(span, thisCode);
      thisCode.parentNode.removeChild(thisCode);
}

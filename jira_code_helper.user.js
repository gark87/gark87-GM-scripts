// ==UserScript==
// @name           Jira {code} Helper
// @namespace      http://gark_87.livejournal.com
// @description    make work with JIRA {code} a little easier
// @include        *jira*/browse/*-*
// @version        0.0.2
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

// constants
var fold   = '[-]';
var unfold = '[+]';
var uniqID = 'gark87';
var monospace = 'font-family: monospace;';

// any <pre> tag
var allPre = document.getElementsByTagName('pre');

for (var i = 0; i < allPre.length; i++) {
      var thisPre = allPre[i];
      var span = document.createElement('span');
      var id = uniqID + i;   // span id
      span.setAttribute('id', id);
      span.setAttribute('style', monospace);

      // button to fold/unfold
      var button = document.createElement('a');
      button.innerHTML = unfold;

      // code to fold/unfold
      button.setAttribute('onClick', 
         'if (this.innerHTML == "' + fold + '") {' +
           'this.innerHTML = "' + unfold + '";' +
           'document.getElementById("' + id + '").setAttribute("style", "' + 
               monospace+'");'+
         '} else {'+
           'this.innerHTML = "' + fold + '";' +
           'document.getElementById("' + id +
               '").setAttribute("style", "display: none;");' +
         '}');

      // try to save format that was inside <pre>
      var lines = thisPre.innerHTML.split(/[\r\n]/);
      for(var j = 0; j < lines.length; j++) {
       var line = lines[j];
       var len = line.length;
       var result = '';
       var nonBlank = 0;
       for(; nonBlank < len && line.charAt(nonBlank) == ' '; nonBlank++)
         result += '&nbsp;';
       span.innerHTML += result + keepBlanks(line.substring(nonBlank, len)) + 
         '<br />';
      }

      // insert <span>
      thisPre.parentNode.insertBefore(span, thisPre);
      // insert <a> button
      thisPre.parentNode.parentNode.insertBefore(button, 
         thisPre.parentNode);
}

// remove all <pre>
for (var i = 0; i < allPre.length;) {
      var thisPre = allPre[i];
      thisPre.parentNode.removeChild(thisPre);
}

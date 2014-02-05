// ==UserScript==
// @name        Show Release versions for version
// @namespace   http://gark_87.livejournal.com
// @description Show Release versions for version
// @include     *jira*/plugins/servlet/project-config/*/versions
// @version     1
// @grant       none
// ==/UserScript==


document.addEventListener("DOMNodeInserted",
function(evt) {
  // another event
  var html = evt.target.innerHTML;
  var prefix = '<div class="project-config-operations-list';
  if (html.substring(0, prefix.length) === prefix) {
    var text = 'View Release Notes';
    if (html.indexOf('>Release<') > 0 && html.indexOf(text) < 0) {
      var project = '10170';
      var version = evt.target.parentNode.innerHTML.match(/<a id="version-(\d*)-operations-trigger"/)[1];    
      evt.target.innerHTML = html.replace(/<\/ul>/, '<li><a class="aui-list-item-link" target="_blank" href="https://' + window.location.host + '/secure/ReleaseNote.jspa?version=' + version + '&styleName=Compact-Text&projectId=' + project +'">' + text +'</a></li></ul>');
    }
  }

}, true);

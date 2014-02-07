// ==UserScript==
// @name        Template Defect Report
// @namespace   http://gark_87.livejournal.com
// @description Template Defect Report
// @include     *jira*/secure/CreateIssue.jspa*
// @include     *jira*/secure/CreateIssueDetails.jspa*
// @version     2
// @grant       none
// ==/UserScript==

var prefixes = [
'Acquire',
'Actions',
'Active Trader',
'Applet',
'ChartGate',
'Chart Grid',
'Client',
'CNBC',
'Corporate Actions',
'Code-style',
'CSDF',
'Data Aggregation',
'Data Box',
'Data Representation',
'DB',
'Drawings',
'Docs',
'Econoday',
'Formatting',
'Integration',
'Manual Corrector',
'Monkey Bars',
'MyTools',
'MTrader',
'News',
'Notifications',
'OnDemand',
'Orders',
'Performance',
'Price Slices',
'Printing',
'Product Depth',
'Repeater',
'Seasonality',
'Server',
'Settings Saving',
'Shell',
'Strategies',
'Studies',
'Style Settings',
'ThinkBack',
'ThinkScript',
'ThinkScript Editor',
'Time Frames',
'Tools',
];

var project = document.getElementById('issue-create-project-name').innerHTML;
var span = document.getElementById('issue-create-issue-type');
var issueType = span.innerHTML;

if (issueType === 'Defect Report') {
  document.getElementById('description').value =
"Steps to Reproduce:\n\
# TBD\n\
\n\
Actual Results:\n\
# TBD\n\
\n\
Expected Results:\n\
# TBD\n\
\n\
Workarounds:\n\
# TBD\n\
\n\
Notes:\n\
# TBD\n\
";
}

if ('TosChart' !== project)
  return;

var div = span.parentNode;

var comboDiv = document.createElement('div');
comboDiv.setAttribute('class', 'field-group');
var label = document.createElement('label');
label.innerHTML = 'Prefix';
label.setAttribute('for', 'create-issue-prefix');
var combo = document.createElement('select');
combo.setAttribute('id', 'create-issue-prefix');
combo.setAttribute('name', 'create-issue-prefix');
combo.setAttribute('class', 'select');
var defaultOption = new Option('<Select prefix>', 1000, true, true);
defaultOption.disabled = true;
combo.appendChild(defaultOption);
var summary = document.getElementById('summary');
combo.setAttribute('onChange', 
"var summary = document.getElementById('summary');\
var combo = document.getElementById('create-issue-prefix');\
summary.value = summary.value.replace(/^([^:]*:)?/, combo.options[combo.selectedIndex].value + ':');");
for (var i = 0; i < prefixes.length; i++) {
  combo.appendChild(new Option(prefixes[i], prefixes[i], false, false));
}
comboDiv.appendChild(label);
comboDiv.appendChild(combo);

div.parentNode.insertBefore(comboDiv, div.nextSibling);

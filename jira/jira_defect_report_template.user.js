// ==UserScript==
// @name        Template Defect Report
// @namespace   http://gark_87.livejournal.com
// @description Template Defect Report
// @include     *jira*/secure/CreateIssue.jspa?*issuetype=1&Create=Create*
// @version     1
// @grant       none
// ==/UserScript==


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

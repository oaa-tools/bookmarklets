/*
*   forms.js: bookmarklet script for highlighting form-related elements
*/

import Bookmarklet from './Bookmarklet';
import { formsCss } from './utils/dom';
import { getAccessibleName } from './utils/getaccname';
import { getElementInfo, formatInfo } from './utils/info';
import { getAriaRole } from './utils/roles';

(function () {
  let targetList = [
    {selector: "button",   color: "purple", label: "button"},
    {selector: "input",    color: "navy",   label: "input"},
    {selector: "keygen",   color: "gray",   label: "keygen"},
    {selector: "meter",    color: "maroon", label: "meter"},
    {selector: "output",   color: "teal",   label: "output"},
    {selector: "progress", color: "olive",  label: "progress"},
    {selector: "select",   color: "green",  label: "select"},
    {selector: "textarea", color: "brown",  label: "textarea"}
  ];

  let selectors = targetList.map(function (tgt) {return '<li>' + tgt.selector + '</li>';}).join('');

  function getInfo (element, target) {
    let info = {
      title:   'FORM INFO',
      element: getElementInfo(element),
      accName: getAccessibleName(element),
      role:    getAriaRole(element)
    };

    return formatInfo(info);
  }

  let params = {
    msgTitle:   "Forms",
    msgText:    "No form-related elements found: <ul>" + selectors + "</ul>",
    targetList: targetList,
    cssClass:   formsCss,
    getInfo:    getInfo,
    dndFlag:    true
  };

  let blt = new Bookmarklet("a11yForms", params);
  blt.run();
})();

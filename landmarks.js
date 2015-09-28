/*
*   landmarks.js: bookmarklet script for highlighting ARIA landmarks
*/

import Bookmarklet from './Bookmarklet';
import { landmarksCss } from './utils/dom';
import { getAttributeValue, getAccessibleName } from './utils/accname';

(function () {
  let targetList = [
    {selector: 'aside:not([role]), [role="complementary"]', color: "brown",  label: "complementary"},
    {selector: 'body > footer, [role="contentinfo"]',       color: "olive",  label: "contentinfo"},
    {selector: '[role="application"]',                      color: "teal",   label: "application"},
    {selector: 'nav, [role="navigation"]',                  color: "green",  label: "navigation"},
    {selector: 'body > header, [role="banner"]',            color: "gray",   label: "banner"},
    {selector: '[role="search"]',                           color: "purple", label: "search"},
    {selector: 'main, [role="main"]',                       color: "navy",   label: "main"}
  ];

  let selectors = targetList.map(function (tgt) {return '<li>' + tgt.selector + '</li>';}).join('');

  function getElementInfo (element) {
    let tagName = element.tagName.toLowerCase();
    let role = getAttributeValue(element, 'role');
    return role.length ? tagName + ' [role="' + role + '"]' : tagName;
  }

  function getInfo (element, target) {
    let elementInfo = getElementInfo(element);
    let accessibleName = getAccessibleName(element) || target.label;
    return 'ELEMENT: ' + elementInfo + '\n' + 'ACC. NAME: ' + accessibleName;
  }

  let params = {
    msgTitle:   "Landmarks",
    msgText:    "No elements with ARIA Landmark roles found: <ul>" + selectors + "</ul>",
    targetList: targetList,
    cssClass:   landmarksCss,
    getInfo:    getInfo,
    dndFlag:    true
  };

  let blt = new Bookmarklet("a11yLandmarks", params);
  blt.run();
})();

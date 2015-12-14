/*
*   landmarks.js: bookmarklet script for highlighting ARIA landmarks
*/

import Bookmarklet from './Bookmarklet';
import { isDescendantOf, landmarksCss } from './utils/dom';
import { getAccessibleName, getAccessibleDesc } from './utils/getaccname';
import { getElementInfo } from './utils/info';
import { getAriaRole } from './utils/roles';

(function () {

  // Filter function called on a list of elements returned by selector
  // 'footer, [role="contentinfo"]'. It returns true for the following
  // conditions: (1) element IS NOT a footer element; (2) element IS a
  // footer element AND IS NOT a descendant of article or section.
  function isContentinfo (element) {
    if (element.tagName.toLowerCase() !== 'footer') return true;
    if (!isDescendantOf(element, ['article', 'section'])) return true;
    return false;
  }

  // Filter function called on a list of elements returned by selector
  // 'header, [role="banner"]'. It returns true for the following
  // conditions: (1) element IS NOT a header element; (2) element IS a
  // header element AND IS NOT a descendant of article or section.
  function isBanner (element) {
    if (element.tagName.toLowerCase() !== 'header') return true;
    if (!isDescendantOf(element, ['article', 'section'])) return true;
    return false;
  }

  let targetList = [
    {selector: 'aside:not([role]), [role~="complementary"], [role~="COMPLEMENTARY"]',         color: "brown",  label: "complementary"},
    {selector: 'footer, [role~="contentinfo"], [role~="CONTENTINFO"]', filter: isContentinfo, color: "olive",  label: "contentinfo"},
    {selector: '[role~="application"], [role~="APPLICATION"]',                                color: "teal",   label: "application"},
    {selector: 'nav, [role~="navigation"], [role~="NAVIGATION"]',                             color: "green",  label: "navigation"},
    {selector: 'header, [role~="banner"], [role~="BANNER"]', filter: isBanner,                color: "gray",   label: "banner"},
    {selector: '[role~="search"], [role~="SEARCH"]',                                          color: "purple", label: "search"},
    {selector: 'main, [role~="main"], [role~="MAIN"]',                                        color: "navy",   label: "main"}
  ];

  let selectors = targetList.map(function (tgt) {return '<li>' + tgt.selector + '</li>';}).join('');

  function getInfo (element, target) {
    let info = {
      title:    'LANDMARK INFO',
      element:  getElementInfo(element),
      accName:  getAccessibleName(element),
      accDesc:  getAccessibleDesc(element),
      role:     getAriaRole(element)
    };

    return info;
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

/*
*   headings.js: bookmarklet script for highlighting HTML heading elements
*/

import Bookmarklet from './Bookmarklet';
import { headingsCss } from './utils/dom';
import { getElementText } from './utils/accname';

(function () {
  let targetList = [
    {selector: "h1", color: "navy",   label: "h1"},
    {selector: "h2", color: "olive",  label: "h2"},
    {selector: "h3", color: "purple", label: "h3"},
    {selector: "h4", color: "green",  label: "h4"},
    {selector: "h5", color: "gray",   label: "h5"},
    {selector: "h6", color: "brown",  label: "h6"}
  ];

  let selectors = targetList.map(function (tgt) {return tgt.selector;}).join(', ');

  function getInfo (element, target) {
    var textContent = getElementText(element);
    return target.label + ": " + textContent;
  }

  let params = {
    msgTitle:   "Headings",
    msgText:    "No heading elements (" + selectors + ") found.",
    targetList: targetList,
    cssClass:   headingsCss,
    getInfo:    getInfo,
    dndFlag:    true
  };

  let blt = new Bookmarklet("a11yHeadings", params);
  blt.run();
})();

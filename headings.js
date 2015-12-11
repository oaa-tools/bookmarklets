/*
*   headings.js: bookmarklet script for highlighting heading elements
*/

import Bookmarklet from './Bookmarklet';
import { headingsCss } from './utils/dom';
import { getAccessibleName, getAccessibleDesc } from './utils/getaccname';
import { getElementInfo } from './utils/info';
import { getAriaRole } from './utils/roles';

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
    let info = {
      title:    'HEADING INFO',
      element:  getElementInfo(element),
      accName:  getAccessibleName(element),
      accDesc:  getAccessibleDesc(element),
      role:     getAriaRole(element),
      props:    'level ' + target.label.substring(1)
    };

    return info;
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

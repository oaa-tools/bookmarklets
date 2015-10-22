/*
*   images.js: bookmarklet script for highlighting image elements
*/

import Bookmarklet from './Bookmarklet';
import { imagesCss } from './utils/dom';
import { getAccessibleName } from './utils/getaccname';
import { getElementInfo, formatInfo } from './utils/info';
import { getAriaRole } from './utils/roles';

(function () {
  let targetList = [
    {selector: "area", color: "teal",   label: "area"},
    {selector: "img",  color: "olive",  label: "img"},
    {selector: "svg",  color: "purple", label: "svg"}
  ];

  let selectors = targetList.map(function (tgt) {return tgt.selector;}).join(', ');

  function getInfo (element, target) {
    let info = {
      title:    'IMAGE INFO',
      element:  getElementInfo(element),
      accName:  getAccessibleName(element),
      role:     getAriaRole(element)
    };

    return formatInfo(info);
  }

  let params = {
    msgTitle:   "Images",
    msgText:    "No image elements (" + selectors + ") found.",
    targetList: targetList,
    cssClass:   imagesCss,
    getInfo:    getInfo,
    dndFlag:    true
  };

  let blt = new Bookmarklet("a11yImages", params);
  blt.run();
})();

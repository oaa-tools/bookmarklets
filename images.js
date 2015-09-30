/*
*   images.js: bookmarklet script for highlighting images.
*/

import Bookmarklet from './Bookmarklet';
import { imagesCss } from './utils/dom';
import { getAccessibleName, getElementText } from './utils/accname';
import { countChildrenWithTagNames } from './utils/utils.js';

(function (utils) {
  let targetList = [
    {selector: "img", color: "pink", label: "img"},
    {selector: "svg", color: "purple", label: "svg"},
    {selector: "area", color: "magenta", label: "area"}
  ];

    let selectors = targetList.map(function (tgt) {return tgt.selector;}).join(', ');

    function getInfo (element, target) {
      let textContent = getElementText(element);
      let accessibleName = getAccessibleName(element);
      return target.label + ": " + textContent + "\n" + "ACC. Name: " + accessibleName;
    } 

    let params = {
      msgTitle: "Images",
      msgText: "No image elements (" + selectors + ") found.",
      targetList: targetList,
      cssClass: imagesCss,
      getInfo: getInfo,
      dndFlag: true
    };
    
    let blt = new Bookmarklet("a11yImages", params);
    blt.run();
})();

/*
*   lists.js: bookmarklet script for highlighting HTML list elements
*/

import Bookmarklet from './Bookmarklet';
import { listsCss } from './utils/dom';
import { getAccessibleName } from './utils/accname';
import { countChildrenWithTagNames } from './utils/utils.js';

(function (utils) {
  let targetList = [
    {selector: "img", color: "pink", label: "img"},
    {selector: "svg", color: "purple", label: "svg"},
    {selector: "area", color: "magenta", label: "area"}
  ];

    let selectors = targetList.map(function (tgt) {return tgt.selector;}).join(', ');
    let accessibleName = getAccessibleName(element);
    
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

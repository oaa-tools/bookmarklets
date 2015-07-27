/*
*   lists.js: bookmarklet script for highlighting HTML list elements
*/

import Bookmarklet from './Bookmarklet';
import { listsCss } from './utils/dom';
import { getAccessibleName } from './utils/accname';

(function () {
  let targetList = [
    {selector: "dl", color: "olive",  label: "dl"},
    {selector: "ol", color: "purple", label: "ol"},
    {selector: "ul", color: "navy",   label: "ul"}
  ];

  let selectors = targetList.map(function (tgt) {return tgt.selector;}).join(', ');

  function getInfo (element, target) {
    let listType;
    switch (target.label) {
      case 'dl':
        listType = 'Definition list'; break;
      case 'ol':
        listType = 'Ordered list'; break;
      case 'ul':
        listType = 'Unordered list'; break;
    }
    let accessibleName = getAccessibleName(element) || listType;
    return 'ACC. NAME: ' + accessibleName;
  }

  let params = {
    msgTitle:   "Lists",
    msgText:    "No list elements (" + selectors + ") found.",
    targetList: targetList,
    cssClass:   listsCss,
    getInfo:    getInfo,
    dndFlag:    true
  };

  let blt = new Bookmarklet("a11yLists", params);
  blt.run();
})();

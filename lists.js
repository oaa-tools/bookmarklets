/*
*   lists.js: bookmarklet script for highlighting list elements
*/

import Bookmarklet from './Bookmarklet';
import { countChildrenWithTagNames, listsCss } from './utils/dom';
import { getAccessibleName, getAccessibleDesc } from './utils/getaccname';
import { getElementInfo } from './utils/info';
import { getAriaRole } from './utils/roles';

(function () {
  let targetList = [
    {selector: "dl", color: "olive",  label: "dl"},
    {selector: "ol", color: "purple", label: "ol"},
    {selector: "ul", color: "navy",   label: "ul"}
  ];

  let selectors = targetList.map(function (tgt) {return tgt.selector;}).join(', ');

  function getInfo (element, target) {
    let listCount;

    switch (target.label) {
      case 'dl':
        listCount = countChildrenWithTagNames(element, ['DT', 'DD']);
        break;
      case 'ol':
      case 'ul':
        listCount = countChildrenWithTagNames(element, ['LI']);
        break;
    }

    let info = {
      title:    'LIST INFO',
      element:  getElementInfo(element),
      accName:  getAccessibleName(element),
      accDesc:  getAccessibleDesc(element),
      role:     getAriaRole(element),
      props:    listCount + ' items'
    };

    return info;
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

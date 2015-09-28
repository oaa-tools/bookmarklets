/*
*   lists.js: bookmarklet script for highlighting HTML list elements
*/

import Bookmarklet from './Bookmarklet';
import { listsCss } from './utils/dom';
import { getAccessibleName } from './utils/accname';
import { countChildrenWithTagNames } from './utils/utils.js';

(function () {
  let targetList = [
    {selector: "dl", color: "olive",  label: "dl"},
    {selector: "ol", color: "purple", label: "ol"},
    {selector: "ul", color: "navy",   label: "ul"}
  ];

  let selectors = targetList.map(function (tgt) {return tgt.selector;}).join(', ');

  function getInfo (element, target) {
    let accessibleName = getAccessibleName(element);

    let roleInfo, listType, listCount;
    switch (target.label) {
      case 'dl':
        listType  = 'Definition list';
        listCount = countChildrenWithTagNames(element, ['DT', 'DD']);
        break;
      case 'ol':
        roleInfo  = 'List';
        listType  = 'Ordered list';
        listCount = countChildrenWithTagNames(element, ['LI']);
        break;
      case 'ul':
        roleInfo  = 'List';
        listType  = 'Unordered list';
        listCount = countChildrenWithTagNames(element, ['LI']);
        break;
    }

    if (roleInfo) {
      if (accessibleName)
        accessibleName = roleInfo + ': ' + accessibleName;
      else
        accessibleName = roleInfo;
    }

    let props = listType + ' with ' + listCount + ' items';

    let info = 'PROPERTIES: ' + props;
    if (accessibleName) info += '\n' + 'ACC. NAME: ' + accessibleName;

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

/*
*   lists.js: bookmarklet script for highlighting HTML list elements
*/

import Bookmarklet from './Bookmarklet';
import { getAccessibleName } from './utils/accname';
import { countChildrenWithTagNames, listsCss } from './utils/dom';
import { formatInfo } from './utils/utils';

(function () {
  let targetList = [
    {selector: "dl", color: "olive",  label: "dl"},
    {selector: "ol", color: "purple", label: "ol"},
    {selector: "ul", color: "navy",   label: "ul"}
  ];

  let selectors = targetList.map(function (tgt) {return tgt.selector;}).join(', ');

  function getInfo (element, target) {
    let roleInfo, listCount;

    switch (target.label) {
      case 'dl':
        roleInfo  = '';
        listCount = countChildrenWithTagNames(element, ['DT', 'DD']);
        break;
      case 'ol':
        roleInfo  = 'list';
        listCount = countChildrenWithTagNames(element, ['LI']);
        break;
      case 'ul':
        roleInfo  = 'list';
        listCount = countChildrenWithTagNames(element, ['LI']);
        break;
    }

    let info = {
      title: 'LIST INFO',
      accName: getAccessibleName(element),
      role: roleInfo,
      props: listCount + ' items'
    };

    return formatInfo(info);
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

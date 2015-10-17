/*
*   interactive.js: bookmarklet script for highlighting all interactive elements
*/

import Bookmarklet from './Bookmarklet';
import { getAccessibleName } from './utils/getaccname';
import { getAttributeValue } from './utils/namefrom';
import { interactiveCss } from './utils/dom';
import { formatInfo } from './utils/utils';

(function () {
  let targetList = [
    {selector: "input",      color: "navy",    label: "input"},
    {selector: "button",     color: "purple",  label: "button"},
    {selector: "label",      color: "olive",   label: "label"},
    {selector: "keygen",     color: "teal",    label: "keygen"},
    {selector: "select",     color: "green",   label: "select"},
    {selector: "textarea",   color: "brown",   label: "textarea"},
    {selector: "audio",      color: "maroon",  label: "audio"},
    {selector: "embed",      color: "gray",    label: "embed"},
    {selector: "iframe",     color: "navy",    label: "iframe"},
    {selector: "img",        color: "purple",  label: "img"},
    {selector: "area",       color: "maroon",  label: "area"},
    {selector: "object",     color: "teal",    label: "object"},
    {selector: "svg",        color: "green",   label: "svg"},
    {selector: "video",      color: "brown",   label: "video"},
    {selector: "a",          color: "olive",   label: "a"},
    {selector: "details",    color: "gray",    label: "details"},
    {selector: "[tabindex]", color: "navy",    label: "tabindex"}
  ];

  let selectors = targetList.map(function (tgt) {return tgt.selector;}).join(', ');

  function getInfo (element, target) {
    let id = element.id,
        type = element.type,
        tagName = element.tagName.toLowerCase(),
        elementInfo = tagName, forVal;

    if (tagName === 'input') {
      if (type && type.length) elementInfo += ' [type="' + type + '"]';
    }
    forVal = getAttributeValue(element, 'for');
    if (forVal && forVal.length) elementInfo += ' [for="' + forVal + '"]';
    if (id && id.length) elementInfo += ' [id="' + id + '"]';

    let info = {
      title: 'INTERACTIVE INFO',
      element: elementInfo,
      accName: getAccessibleName(element)
    };

    return formatInfo(info);
  }

  let params = {
    msgTitle:   "Interactive",
    msgText:    "No interactive elements (" + selectors + ") found.",
    targetList: targetList,
    cssClass:   interactiveCss,
    getInfo:    getInfo,
    dndFlag:    true
  };

  let blt = new Bookmarklet("a11yInteractive", params);
  blt.run();
})();

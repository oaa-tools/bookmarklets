/*
*   interactive.js: bookmarklet script for highlighting all interactive elements
*/

import Bookmarklet from './Bookmarklet';
import { interactiveCss } from './utils/dom';
import { getAccessibleName } from './utils/getaccname';
import { getElementInfo, formatInfo } from './utils/info';

(function () {
  let targetList = [
    {selector: "input",      color: "navy",   label: "input"},
    {selector: "button",     color: "olive",  label: "button"},
    {selector: "label",      color: "purple", label: "label"},
    {selector: "keygen",     color: "teal",   label: "keygen"},
    {selector: "meter",      color: "maroon", label: "meter"},
    {selector: "output",     color: "brown",  label: "output"},
    {selector: "progress",   color: "gray",   label: "progress"},
    {selector: "select",     color: "green",  label: "select"},
    {selector: "textarea",   color: "navy",   label: "textarea"},

    {selector: "audio",      color: "olive",  label: "audio"},
    {selector: "embed",      color: "purple", label: "embed"},
    {selector: "iframe",     color: "teal",   label: "iframe"},
    {selector: "img",        color: "maroon", label: "img"},
    {selector: "area",       color: "brown",  label: "area"},
    {selector: "object",     color: "gray",   label: "object"},
    {selector: "svg",        color: "green",  label: "svg"},
    {selector: "video",      color: "navy",   label: "video"},

    {selector: "a",          color: "olive",  label: "a"},
    {selector: "details",    color: "purple", label: "details"},
    {selector: "[tabindex]", color: "teal",   label: "tabindex"}
  ];

  let selectors = targetList.map(function (tgt) {return tgt.selector;}).join(', ');

  function getInfo (element, target) {
    let info = {
      title: 'INTERACTIVE INFO',
      element: getElementInfo(element),
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

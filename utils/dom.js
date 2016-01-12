/*
*   dom.js: functions and constants for adding and removing DOM overlay elements
*/

import { createOverlay, addDragAndDrop } from './overlay';
import { formatInfo } from './info';

/* eslint no-console: 0 */
let consoleOutput = false;

/*
*   isVisible: Recursively check element properties from getComputedStyle
*   until document element is reached, to determine whether element or any
*   of its ancestors has properties set that affect its visibility. Called
*   by addNodes function.
*/
function isVisible (element) {

  function isVisibleRec (el) {
    if (el.nodeType === Node.DOCUMENT_NODE) return true;

    let computedStyle = window.getComputedStyle(el, null);
    let display = computedStyle.getPropertyValue('display');
    let visibility = computedStyle.getPropertyValue('visibility');
    let hidden = el.getAttribute('hidden');
    let ariaHidden = el.getAttribute('aria-hidden');

    if ((display === 'none') || (visibility === 'hidden') ||
        (hidden !== null) || (ariaHidden === 'true')) {
      return false;
    }
    return isVisibleRec(el.parentNode);
  }

  return isVisibleRec(element);
}

/*
*   countChildrenWithTagNames: For the specified DOM element, return the
*   number of its child elements with tagName equal to one of the values
*   in the tagNames array.
*/
export function countChildrenWithTagNames (element, tagNames) {
  let count = 0;

  let child = element.firstElementChild;
  while (child) {
    if (tagNames.indexOf(child.tagName) > -1) count += 1;
    child = child.nextElementSibling;
  }

  return count;
}

/*
*   isDescendantOf: Determine whether element is a descendant of any
*   element in the DOM with a tagName in the list of tagNames.
*/
export function isDescendantOf (element, tagNames) {
  if (typeof element.closest === 'function') {
    return tagNames.some(name => element.closest(name) !== null);
  }
  return false;
}

/*
*   hasParentWithName: Determine whether element has a parent with
*   tagName in the list of tagNames.
*/
export function hasParentWithName (element, tagNames) {
  let parentTagName = element.parentElement.tagName.toLowerCase();
  if (parentTagName) {
    return tagNames.some(name => parentTagName === name);
  }
  return false;
}

/*
*   addNodes: Use targetList to generate nodeList of elements and to
*   each of these, add an overlay with a unique CSS class name.
*   Optionally, if getInfo is specified, add tooltip information;
*   if dndFlag is set, add drag-and-drop functionality.
*/
export function addNodes (params) {
  let { targetList, cssClass, getInfo, evalInfo, dndFlag } = params;
  let counter = 0;

  targetList.forEach(function (target) {
    // Collect elements based on selector defined for target
    let elements = document.querySelectorAll(target.selector);
    if (consoleOutput && elements.length)
      console.log(target.label + ": " + elements.length);

    // Filter elements if target defines a filter function
    if (typeof target.filter === 'function')
      elements = Array.prototype.filter.call(elements, target.filter);

    Array.prototype.forEach.call(elements, function (element) {
      if (isVisible(element)) {
        let info = getInfo(element, target);
        if (consoleOutput && info.accName)
          console.log("accName: " + info.accName.name);
        if (evalInfo) evalInfo(info, target);
        let boundingRect = element.getBoundingClientRect();
        let overlayNode = createOverlay(target, boundingRect, cssClass);
        if (dndFlag) addDragAndDrop(overlayNode);
        overlayNode.title = formatInfo(info);
        document.body.appendChild(overlayNode);
        counter += 1;
      }
    });
  });

  return counter;
}

/*
*   removeNodes: Use the unique CSS class name supplied to addNodes
*   to remove all instances of the overlay nodes.
*/
export function removeNodes (cssClass) {
  let selector = "div." + cssClass;
  let elements = document.querySelectorAll(selector);
  Array.prototype.forEach.call(elements, function (element) {
    document.body.removeChild(element);
  });
}

/*
*   Unique CSS class names
*/
export const formsCss       = "a11yGfdXALm0";
export const headingsCss    = "a11yGfdXALm1";
export const imagesCss      = "a11yGfdXALm2";
export const landmarksCss   = "a11yGfdXALm3";
export const listsCss       = "a11yGfdXALm4";
export const interactiveCss = "a11yGfdXALm5";

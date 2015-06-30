/*
*   dom.js: functions and constants for adding and removing DOM overlay elements
*/

import { createOverlay, addDragAndDrop } from './overlay';

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
*   addNodes: Use targetList to generate nodeList of elements and to
*   each of these, add an overlay with a unique CSS class name.
*   Optionally, if getInfo is specified, add tooltip information;
*   if dndFlag is set, add drag-and-drop functionality.
*/
export function addNodes (params) {
  let { targetList, cssClass, getInfo, dndFlag } = params;
  let counter = 0;

  targetList.forEach(function (target) {
    var elements = document.querySelectorAll(target.selector);

    Array.prototype.forEach.call(elements, function (element) {
      var boundingRect, overlayNode;
      if (isVisible(element)) {
        boundingRect = element.getBoundingClientRect();
        overlayNode = createOverlay(target, boundingRect, cssClass);
        if (dndFlag) addDragAndDrop(overlayNode);
        if (getInfo) overlayNode.title = getInfo(element, target);
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
export const formsCss     = "a11yGfdXALm0";
export const headingsCss  = "a11yGfdXALm1";
export const imagesCss    = "a11yGfdXALm2";
export const landmarksCss = "a11yGfdXALm3";
export const listsCss     = "a11yGfdXALm4";

/*
*   overlay.js: functions for creating and modifying DOM overlay elements
*/

import { getScrollOffsets, drag } from './utils';
let zIndex = 100000;

/*
*   createOverlay: Create overlay div with size and position based on the
*   boundingRect properties of its corresponding target element.
*/
export function createOverlay (tgt, rect, cname) {
  var node = document.createElement("div");
  var scrollOffsets = getScrollOffsets();
  var innerStyle = "background-color: " + tgt.color;
  var minWidth  = 34;
  var minHeight = 27;

  node.setAttribute("class", [cname, 'oaa-element-overlay'].join(' '));
  node.startLeft = (rect.left + scrollOffsets.x) + "px";
  node.startTop  = (rect.top  + scrollOffsets.y) + "px";

  node.style.left = node.startLeft;
  node.style.top  = node.startTop;
  node.style.width  = Math.max(rect.width, minWidth) + "px";
  node.style.height = Math.max(rect.height, minHeight) + "px";
  node.style.borderColor = tgt.color;
  node.style.zIndex = zIndex;

  node.innerHTML = '<div style="' + innerStyle + '">' + tgt.label + '</div>';
  return node;
}

/*
*   addDragAndDrop: Add drag-and-drop and reposition functionality to an
*   overlay div element created by the createOverlay function.
*/
export function addDragAndDrop (node) {

  function hoistZIndex (el) {
    let incr = 100;
    el.style.zIndex = zIndex += incr;
  }

  function repositionOverlay (el) {
    el.style.left = el.startLeft;
    el.style.top  = el.startTop;
  }

  let labelDiv = node.firstChild;

  labelDiv.onmousedown = function (event) {
    drag(this.parentNode, hoistZIndex, event);
  };

  labelDiv.ondblclick = function (event) {
    repositionOverlay(this.parentNode);
  };
}

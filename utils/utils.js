/*
*   utils.js: utility functions
*/

/*
*   getScrollOffsets: Use x and y scroll offsets to calculate positioning
*   coordinates that take into account whether the page has been scrolled.
*   From Mozilla Developer Network: Element.getBoundingClientRect()
*/
export function getScrollOffsets () {
  var t;

  var xOffset = (typeof window.pageXOffset === "undefined") ?
    (((t = document.documentElement) || (t = document.body.parentNode)) &&
      typeof t.ScrollLeft == 'number' ? t : document.body).ScrollLeft :
    window.pageXOffset;

  var yOffset = (typeof window.pageYOffset === "undefined") ?
    (((t = document.documentElement) || (t = document.body.parentNode)) &&
      typeof t.ScrollTop == 'number' ? t : document.body).ScrollTop :
    window.pageYOffset;

  return { x: xOffset, y: yOffset };
}

/*
*   drag: Add drag and drop functionality to an element by setting this
*   as its mousedown handler. Depends upon getScrollOffsets function.
*   From JavaScript: The Definitive Guide, 6th Edition (slightly modified)
*/
export function drag (elementToDrag, dragCallback, event) {
  var scroll = getScrollOffsets();
  var startX = event.clientX + scroll.x;
  var startY = event.clientY + scroll.y;

  var origX = elementToDrag.offsetLeft;
  var origY = elementToDrag.offsetTop;

  var deltaX = startX - origX;
  var deltaY = startY - origY;

  if (dragCallback) dragCallback(elementToDrag);

  if (document.addEventListener) {
    document.addEventListener("mousemove", moveHandler, true);
    document.addEventListener("mouseup", upHandler, true);
  }
  else if (document.attachEvent) {
    elementToDrag.setCapture();
    elementToDrag.attachEvent("onmousemove", moveHandler);
    elementToDrag.attachEvent("onmouseup", upHandler);
    elementToDrag.attachEvent("onlosecapture", upHandler);
  }

  if (event.stopPropagation) event.stopPropagation();
  else event.cancelBubble = true;

  if (event.preventDefault) event.preventDefault();
  else event.returnValue = false;

  function moveHandler (e) {
    if (!e) e = window.event;

    var scroll = getScrollOffsets();
    elementToDrag.style.left = (e.clientX + scroll.x - deltaX) + "px";
    elementToDrag.style.top = (e.clientY + scroll.y - deltaY) + "px";

    elementToDrag.style.cursor = "move";

    if (e.stopPropagation) e.stopPropagation();
    else e.cancelBubble = true;
  }

  function upHandler (e) {
    if (!e) e = window.event;

    elementToDrag.style.cursor = "grab";
    elementToDrag.style.cursor = "-moz-grab";
    elementToDrag.style.cursor = "-webkit-grab";

    if (document.removeEventListener) {
        document.removeEventListener("mouseup", upHandler, true);
        document.removeEventListener("mousemove", moveHandler, true);
    }
    else if (document.detachEvent) {
        elementToDrag.detachEvent("onlosecapture", upHandler);
        elementToDrag.detachEvent("onmouseup", upHandler);
        elementToDrag.detachEvent("onmousemove", moveHandler);
        elementToDrag.releaseCapture();
    }

    if (e.stopPropagation) e.stopPropagation();
    else e.cancelBubble = true;
  }
}

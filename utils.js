/* https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect */

function getScrollOffsets() {
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

/* Modified version of the above (slightly more readable) */

function getScrollOffsets() {
  var t;

  if (typeof window.pageXOffset === 'undefined' || typeof window.pageYOffset === 'undefined') {
    t = document.documentElement;
    if (t && (typeof t.ScrollLeft === 'number') && (typeof t.ScrollTop === 'number'))
      return { x: t.ScrollLeft, y: t.ScrollTop };

    t = document.body.parentNode;
    if (t && (typeof t.ScrollLeft === 'number') && (typeof t.ScrollTop === 'number'))
      return { x: document.body.ScrollLeft, y: document.body.ScrollTop };
  }
  else {
    return { x: window.pageXOffset, y: window.pageYOffset };
  }
}

/*
* From JavaScript: The Definitive Guide, Sixth Edition, with the following modifications:
* (1) removed all comments
* (2) added upHandlerCallback parameter
*/

function drag(elementToDrag, upHandlerCallback, event) {
  var scroll = getScrollOffsets();
  var startX = event.clientX + scroll.x;
  var startY = event.clientY + scroll.y;

  var origX = elementToDrag.offsetLeft;
  var origY = elementToDrag.offsetTop;

  var deltaX = startX - origX;
  var deltaY = startY - origY;

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

  function moveHandler(e) {
    if (!e) e = window.event;

    var scroll = getScrollOffsets();
    elementToDrag.style.left = (e.clientX + scroll.x - deltaX) + "px";
    elementToDrag.style.top = (e.clientY + scroll.y - deltaY) + "px";

    if (e.stopPropagation) e.stopPropagation();
    else e.cancelBubble = true;
  }

  function upHandler(e) {
    if (!e) e = window.event;

    if (upHandlerCallback) upHandlerCallback(elementToDrag);

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

/* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim */

if (!String.prototype.trim) {
  (function() {
    var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    String.prototype.trim = function() {
      return this.replace(rtrim, '');
    };
  })();
}

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
* (2) added dragCallback parameter
* (3) added style.cursor grab and move settings
*/

function drag (elementToDrag, dragCallback, event) {
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

/* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim */

if (!String.prototype.trim) {
  (function() {
    var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    String.prototype.trim = function() {
      return this.replace(rtrim, '');
    };
  })();
}

function normalize (s) {
  var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
  return s.replace(rtrim, '').replace(/\s+/g, ' ');
}

function getAttributeValue (element, attribute) {
  var value = element.getAttribute(attribute);
  return (value === null) ? '' : value;
}

function getElementText (element) {
  var arrayOfStrings;

  function getTextRec (node, arr) {
    var tagName, altText, content;

    switch (node.nodeType) {
      case (Node.ELEMENT_NODE):
        tagName = node.tagName.toLowerCase();
        if (tagName === 'img' || tagName === 'area') {
          altText = normalize(getAttributeValue(node, "alt"));
          if (altText.length) arr.push(altText);
        }
        else {
          if (node.hasChildNodes()) {
            Array.prototype.forEach.call(node.childNodes, function (n) {
              getTextRec(n, arr);
            });
          }
        }
        break;
      case (Node.TEXT_NODE):
        content = normalize(node.textContent);
        if (content.length) arr.push(content);
        break;
      default:
        break;
    }

    return arr;
  }

  arrayOfStrings = getTextRec(element, []);
  if (arrayOfStrings.length)
    return arrayOfStrings.join(' ');
  return '';
}

/* global OAAUtils: true */

var OAAUtils = (function () {

  //--------------------------------------------------------------
  // private functions and variables
  //--------------------------------------------------------------
  var zIndex = 100000;

  /*
  * getScrollOffsets: Use x and y scroll offsets to calculate positioning
  * coordinates that take into account whether the page has been scrolled.
  * From Mozilla Developer Network: Element.getBoundingClientRect()
  */
  var getScrollOffsets = function () {
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
  };

  /*
  * drag: Add drag and drop functionality to an element by setting this
  * as its mousedown handler. Depends upon getScrollOffsets function.
  * From JavaScript: The Definitive Guide, 6th Edition (slightly modified)
  */
  var drag = function (elementToDrag, dragCallback, event) {
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
  };

  /*
  * createOverlay: Core function for bookmarklets that creates, positions
  * and sets properties and event handlers on each outline overlay.
  */
  var createOverlay = function (tgt, rect, cname) {
    var node = document.createElement("div");
    var scrollOffsets = getScrollOffsets();
    var innerStyle = "background-color: " + tgt.color;
    var minWidth  = 34;
    var minHeight = 27;

    function repositionOverlay (element) {
      if (typeof element.startLeft === "undefined") return;
      element.style.left = element.startLeft;
      element.style.top  = element.startTop;
    }

    function hoistZIndex (element) {
      var incr = 100;
      zIndex += incr;
      element.style.zIndex = zIndex;
    }

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

    node.onmousedown = function (event) {
      drag(this, hoistZIndex, event);
    };

    node.ondblclick = function (event) {
      repositionOverlay(this);
    };

    return node;
  };

  /*
  * elementInfo: Use for debugging, for example with isVisible fn.
  */
  var elementInfo = function (element) {
    var tagName = element.tagName.toLowerCase();

    if (tagName === 'input' && element.type)
      tagName +=  element.type.length ? '[type="' + element.type + '"]' : '[type="text"]';

    return element.id ? tagName + '[id="' + element.id + '"]' : tagName;
  };

  /*
  * isVisible: Recursively check element properties from getComputedStyle
  * until document element is reached, to determine whether element or any
  * of its ancestors has properties set that affect its visibility. Called
  * by addNodes function.
  */
  var isVisible = function (element) {

    function isVisibleRec (el) {
      if (el.nodeType === Node.DOCUMENT_NODE) return true;

      var computedStyle = window.getComputedStyle(el, null);
      var display = computedStyle.getPropertyValue('display');
      var visibility = computedStyle.getPropertyValue('visibility');
      var hidden = el.getAttribute('hidden');
      var ariaHidden = el.getAttribute('aria-hidden');

      if ((display === 'none') || (visibility === 'hidden') ||
          (hidden !== null) || (ariaHidden === 'true')) {
        return false;
      }
      return isVisibleRec(el.parentNode);
    }

    return isVisibleRec(element);
  };

  // message dialog functions

  /*
  * setBoxGeometry: Set the width and position of message dialog based on
  * the width of the browser window. Called by functions resizeMessage and
  * createMsgOverlay.
  */
  var setBoxGeometry = function (overlay) {
    var width  = window.innerWidth / 3.2;
    var left   = window.innerWidth / 2 - width / 2;
    var scroll = getScrollOffsets();

    overlay.style.width = width + "px";
    overlay.style.left  = (scroll.x + left) + "px";
    overlay.style.top   = (scroll.y + 30) + "px";
  };

  /*
  * createMsgOverlay: Construct and position the message dialog whose
  * purpose is to alert the user when no target elements are found by
  * a bookmarklet.
  */
  var createMsgOverlay = function (handler) {
    var overlay = document.createElement("div");
    var button  = document.createElement("button");

    overlay.className = "oaa-message-dialog";
    setBoxGeometry(overlay);

    button.onclick = handler;

    overlay.appendChild(button);
    document.body.appendChild(overlay);
    return overlay;
  };

  /*
  * deleteMsgOverlay: Use reference to delete message dialog.
  */
  var deleteMsgOverlay = function (overlay) {
    if (overlay) document.body.removeChild(overlay);
  };

  /*
  * normalize: Trim leading and trailing whitespace and condense all
  * interal sequences of whitespace to a single space. Adapted from
  * Mozilla documentation on String.prototype.trim polyfill. Handles
  * BOM and NBSP characters.
  */
  var normalize = function (s) {
    var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    return s.replace(rtrim, '').replace(/\s+/g, ' ');
  };

  // accessible name functions

  /*
  * getAttributeValue: Return attribute value if present on element,
  * otherwise return empty string.
  */
  var getAttributeValue = function (element, attribute) {
    var value = element.getAttribute(attribute);
    return (value === null) ? '' : normalize(value);
  };

  /*
  * getElementText: Recursively concatenate the text nodes of element and
  * alt text of 'img' and 'area' children of element and its descendants.
  */
  var getElementText = function (element) {
    var arrayOfStrings;

    function getTextRec (node, arr) {
      var tagName, altText, content;

      switch (node.nodeType) {
        case (Node.ELEMENT_NODE):
          tagName = node.tagName.toLowerCase();
          if (tagName === 'img' || tagName === 'area') {
            altText = getAttributeValue(node, "alt");
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
  };

  /*
  * getRefElementAccessibleName: Get text content from element and
  * if that is empty, get its title attribute value, and if that is
  * null or empty return an empty string.
  */
  var getRefElementAccessibleName = function (element) {
    var textContent;

    if (element === null) return '';

    textContent = getElementText(element);
    if (textContent) return textContent;

    if (element.title) return normalize(element.title);
    return '';
  };

  /*
  * getAttributeIdRefsValue: Get the IDREFS value of specified attribute
  * and return the concatenated string based on referencing each of the
  * IDREF values. See getRefElementAccessibleName
  */
  var getAttributeIdRefsValue = function (element, attribute) {
    var value = element.getAttribute(attribute);
    var idRefs, i, refElement, accName, text = [];

    if (value && value.length) {
      idRefs = value.split(' ');

      for (i = 0; i < idRefs.length; i++) {
        refElement = document.getElementById(idRefs[i]);
        accName = getRefElementAccessibleName(refElement);
        if (accName.length) text.push(accName);
      }
    }

    if (text.length) return text.join(' ');
    return '';
  };

  //--------------------------------------------------------------
  // public methods
  //--------------------------------------------------------------

  return {
    normalize: normalize,
    getAttributeValue: getAttributeValue,
    getElementText: getElementText,
    getAttributeIdRefsValue: getAttributeIdRefsValue,

    addNodes: function (targetList, className, getTitleText) {
      var counter = 0;

      targetList.forEach(function (target) {
        var elements = document.querySelectorAll(target.selector);

        Array.prototype.forEach.call(elements, function (element) {
          var boundingRect, overlayNode;
          if (isVisible(element)) {
            boundingRect = element.getBoundingClientRect();
            overlayNode = createOverlay(target, boundingRect, className);
            overlayNode.title = getTitleText(element, target);
            document.body.appendChild(overlayNode);
            counter += 1;
          }
        });
      });

      return counter;
    },

    removeNodes: function (className) {
      var selector = "div." + className;
      var elements = document.querySelectorAll(selector);
      Array.prototype.forEach.call(elements, function (element) {
        document.body.removeChild(element);
      });
    },

    showMessage: function (title, message) {
      var h2, div;

      if (!window.a11yMessageDialog)
        window.a11yMessageDialog = createMsgOverlay(this.hideMessage);

      h2 = document.createElement("h2");
      h2.innerHTML = title;
      window.a11yMessageDialog.appendChild(h2);

      div = document.createElement("div");
      div.innerHTML = message;
      window.a11yMessageDialog.appendChild(div);
    },

    hideMessage: function () {
      if (window.a11yMessageDialog) {
        deleteMsgOverlay(window.a11yMessageDialog);
        delete(window.a11yMessageDialog);
      }
    },

    resizeMessage: function () {
      if (window.a11yMessageDialog)
        setBoxGeometry(window.a11yMessageDialog);
    }
  };
})();

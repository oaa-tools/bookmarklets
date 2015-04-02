var OAAUtils = (function () {

  // ------------------------------------------------
  // private functions
  // ------------------------------------------------

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

  var setBoxGeometry = function (overlay) {
    var width  = window.innerWidth / 3.2;
    var left   = window.innerWidth / 2 - width / 2;
    var scroll = getScrollOffsets();

    overlay.style.width = width + "px";
    overlay.style.left  = (scroll.x + left) + "px";
    overlay.style.top   = (scroll.y + 30) + "px";
  };

  var normalize = function (s) {
    var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    return s.replace(rtrim, '').replace(/\s+/g, ' ');
  };

  var createMsgOverlay = function (handler) {
    var overlay = document.createElement("div");
    var button  = document.createElement("button");

    overlay.className = "oaa-message-dialog";
    setBoxGeometry(overlay);

    button.title = "Close message dialog";
    button.onclick = handler;
    button.innerHTML = "x";

    overlay.appendChild(button);
    document.body.appendChild(overlay);
    return overlay;
  };

  var deleteMsgOverlay = function (overlay) {
    if (overlay) document.body.removeChild(overlay);
  };

  var getAttributeValue = function (element, attribute) {
    var value = element.getAttribute(attribute);
    return (value === null) ? '' : value;
  };

  var getElementText = function (element) {
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
  };

  var getRefElementAccessibleName = function (element) {
    var textContent;

    if (element === null) return '';

    textContent = getElementText(element);
    if (textContent) return textContent;

    if (element.title) return normalize(element.title);
    return '';
  };

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

  // ------------------------------------------------
  // public methods
  // ------------------------------------------------

  return {
    getScrollOffsets: getScrollOffsets,
    getElementText: getElementText,

    hideMessage: function () {
      if (window.a11yMessageDialog) {
        deleteMsgOverlay(window.a11yMessageDialog);
        delete(window.a11yMessageDialog);
      }
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

    resizeMessage: function () {
      if (window.a11yMessageDialog)
        setBoxGeometry(window.a11yMessageDialog);
    },

    getAccessibleName: function (element) {
      var name;

      name = getAttributeIdRefsValue(element, "aria-labelledby");
      if (name.length) return name;

      name = getAttributeValue(element, "aria-label");
      if (name.length) return name;

      name = getAttributeValue(element, "title");
      if (name.length) return name;

      return '';
    },

    // From JavaScript: The Definitive Guide, 6th Edition (slightly modified)

    drag: function (elementToDrag, dragCallback, event) {
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

  };
})();

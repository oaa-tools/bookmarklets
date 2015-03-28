javascript: (function () {
  var targetList = [
    {selector: 'body > header, [role="banner"]',            color: "gray",   label: "banner"},
    {selector: 'main, [role="main"]',                       color: "navy",   label: "main"},
    {selector: 'body > footer, [role="contentinfo"]',       color: "olive",  label: "contentinfo"},
    {selector: 'aside:not([role]), [role="complementary"]', color: "brown",  label: "complementary"},
    {selector: 'nav, [role="navigation"]',                  color: "green",  label: "navigation"},
    {selector: '[role="search"]',                           color: "purple", label: "search"}
  ];

  var className = "a11yGfdXALm0";
  var zIndex    = 100000;

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

  function getRefElementAccessibleName (element) {
    var textContent;

    if (element === null) return '';

    textContent = getElementText(element);
    if (textContent) return textContent;

    if (element.title) return normalize(element.title);
    return '';
  }

  function getAttributeIdRefsValue (element, attribute) {
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
  }

  function getAccessibleName (element) {
    var name;

    name = getAttributeIdRefsValue(element, "aria-labelledby");
    if (name.length) return name;

    name = getAttributeValue(element, "aria-label");
    if (name.length) return name;

    name = getAttributeValue(element, "title");
    if (name.length) return name;

    return '';
  }

  function getScrollOffsets () {
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

  function createOverlay (tgt, rect) {
    var innerStyle = "float: right; background-color: " + tgt.color + "; padding: 1px 1px 4px 4px";
    var node = document.createElement("div");
    var scrollOffsets = getScrollOffsets();
    var minHeight = 27;

    function repositionOverlay (element) {
      if (typeof element.startLeft === "undefined") return;
      element.style.left = element.startLeft;
      element.style.top = element.startTop;
    }

    function hoistZIndex (element) {
      var incr = 100;
      zIndex += incr;
      element.style.zIndex = zIndex;
    }

    node.setAttribute("class", className);

    node.style.position = "absolute";
    node.style.overflow = "hidden";
    node.style.zIndex = zIndex;

    node.startLeft = (rect.left + scrollOffsets.x) + "px";
    node.startTop = (rect.top + scrollOffsets.y) + "px";

    node.style.left = node.startLeft;
    node.style.top = node.startTop;
    node.style.height = Math.max(rect.height, minHeight) + "px";
    node.style.width = rect.width + "px";

    node.style.boxSizing = "border-box";
    node.style.border = "3px solid " + tgt.color;
    node.style.color = "white";
    node.style.fontFamily = "Arial, Helvetica, 'Liberation Sans', sans-serif";
    node.style.fontSize = "16px";

    node.innerHTML = '<div style="' + innerStyle + '">' + tgt.label + '</div>';

    node.onmouseover = function (event) {
      this.style.cursor = "grab";
      this.style.cursor = "-moz-grab";
      this.style.cursor = "-webkit-grab";
    };

    node.onmousedown = function (event) {
      drag(this, hoistZIndex, event);
    };

    node.ondblclick = function (event) {
      repositionOverlay(this);
      document.body.style.cursor = "auto";
    };

    return node;
  }

  function issueWarning () {
    var msg = "No elements with ARIA landmark roles found:\n";

    function getSelectorList () {
      var i, target, list = [];

      for (i = 0; i < targetList.length; i++) {
        target = targetList[i].selector;
        list.push(target);
      }
      return list.join('\n');
    }

    window.alert(msg + '\n' + getSelectorList());
  }

  function addNodes () {
    var counter = 0;

    targetList.forEach(function (target) {
      var elements = document.querySelectorAll(target.selector);
      var accessibleName;

      Array.prototype.forEach.call(elements, function (element) {
        var boundingRect = element.getBoundingClientRect();
        var overlayNode = createOverlay(target, boundingRect);
        var text = getAccessibleName(element);
        accessibleName = text.length ?
          target.label + ": " + text :
          target.label;
        overlayNode.title = accessibleName;
        document.body.appendChild(overlayNode);
        counter += 1;
      });
    });

    if (counter === 0) {
      window.a11yShowLandmarks = false;
      issueWarning();
    }
  }

  function removeNodes () {
    var selector = "div." + className;
    var elements = document.querySelectorAll(selector);
    Array.prototype.forEach.call(elements, function (element) {
      document.body.removeChild(element);
    });
  }

  window.accessibility = function (flag) {
    window.a11yShowLandmarks = (typeof flag === "undefined") ? true : !flag;
    if (window.a11yShowLandmarks) addNodes();
    else removeNodes();
  };

  window.onresize = function () { removeNodes(); window.a11yShowLandmarks = false; };
  window.accessibility(window.a11yShowLandmarks);
})();

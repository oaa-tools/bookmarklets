javascript: (function() {
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

  if (!String.prototype.trim) {
    (function() {
      var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
      String.prototype.trim = function() {
        return this.replace(rtrim, '');
      };
    })();
  }

  function collectAltText (listOfImages) {
    var i, image, text =[];

    for (i = 0; i < listOfImages.length; i++) {
      image = listOfImages[i];
      if (image.alt && image.alt.trim().length)
        text.push(image.alt);
    }

    if (text.length) return text.join(' ');

    return '';
  }

  function getRefElementAccessibleName (element) {
    var ariaLabel, images, altText, textContent;

    if (element === null) return '';

    ariaLabel = getAttributeValue(element, "aria-label");
    if (ariaLabel) return ariaLabel;

    images = element.getElementsByTagName('img');
    if (images.length) {
      altText = collectAltText(images);
      if (altText) return altText;
    }

    textContent = element.textContent.trim();
    if (textContent) return textContent;

    if (element.title) return element.title.trim();

    return '';
  }

  function getAttributeIdRefsValue (element, attribute) {
    var value = element.getAttribute(attribute);
    var idRefs, i, refElement, accName, text = [];

    if (value && value.length) {
      idRefs = value.split(' ');

      for (i = 0; i < idRefs.length; i++) {
        refElement = document.getElementById(idRefs[i]);
        accName = getRefElementAccessibleName(refElement).trim();
        if (accName.length) text.push(accName);
      }
    }

    if (text.length) return text.join(' ');

    return '';
  }

  function getAttributeValue (element, attribute) {
    var value = element.getAttribute(attribute);
    return (value === null) ? '' : value;
  }

  function getAccessibleName (element) {
    var name;

    name = getAttributeIdRefsValue(element, "aria-labelledby");
    if (name.length) return name;

    name = getAttributeValue(element, "aria-label");
    if (name.length) return name;

    name = getAttributeValue(element, "title");
    if (name.length) return name;

    return "not found";
  }

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

    node.onmousedown = function (event) {
      drag(this, hoistZIndex, event);
    };
    node.ondblclick = function (event) {
      repositionOverlay(this);
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

      Array.prototype.forEach.call(elements, function (element) {
        var boundingRect = element.getBoundingClientRect();
        var overlayNode = createOverlay(target, boundingRect);
        var prefix = target.label + " accessible name:\n";
        overlayNode.title = prefix + getAccessibleName(element);
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

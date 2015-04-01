javascript: (function (utils) {
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

  function createOverlay (tgt, rect) {
    var innerStyle = "float: right; background-color: " + tgt.color + "; padding: 1px 1px 4px 4px";
    var node = document.createElement("div");
    var scrollOffsets = utils.getScrollOffsets();
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
      utils.drag(this, hoistZIndex, event);
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
        var text = utils.getAccessibleName(element);
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
})(OAAUtils);

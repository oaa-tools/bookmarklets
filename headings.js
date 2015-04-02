(function (utils) {
  var targetList = [
    {selector: "h1", color: "navy",   label: "h1"},
    {selector: "h2", color: "olive",  label: "h2"},
    {selector: "h3", color: "purple", label: "h3"},
    {selector: "h4", color: "green",  label: "h4"},
    {selector: "h5", color: "gray",   label: "h5"},
    {selector: "h6", color: "brown",  label: "h6"}
  ];

  var className  = "a11yGfdXALm1";
  var zIndex = 100000;

  function createOverlay (tgt, rect) {
    var innerStyle = "float: right; background-color: " + tgt.color + "; padding: 1px 1px 4px 4px";
    var node = document.createElement("div");
    var scrollOffsets = utils.getScrollOffsets();
    var minWidth  = 34;
    var minHeight = 27;

    node.setAttribute("class", className);

    node.style.position = "absolute";
    node.style.overflow = "hidden";
    node.style.zIndex = zIndex;

    node.startLeft = (rect.left + scrollOffsets.x) + "px";
    node.startTop  = (rect.top + scrollOffsets.y) + "px";

    node.style.left   = node.startLeft;
    node.style.top    = node.startTop;
    node.style.width  = Math.max(rect.width, minWidth) + "px";
    node.style.height = Math.max(rect.height, minHeight) + "px";

    node.style.boxSizing  = "border-box";
    node.style.border     = "3px solid " + tgt.color;
    node.style.color      = "white";
    node.style.fontFamily = "Arial, Helvetica, 'Liberation Sans', sans-serif";
    node.style.fontSize   = "16px";

    node.innerHTML = '<div style="' + innerStyle + '">' + tgt.label + '</div>';
    return node;
  }

  function hideMessage () {
    if (window.a11yMsgHeadings) {
      utils.deleteMsgOverlay(window.a11yMsgHeadings);
      delete(window.a11yMsgHeadings);
      window.a11yShowHeadings = false;
    }
  }

  function showMessage () {
    var titleText = "Headings",
        msgText = "No heading elements (h1..h6) found.",
        h2, div;

    if (!window.a11yMsgHeadings)
      window.a11yMsgHeadings = utils.createMsgOverlay(hideMessage);

    h2 = document.createElement("h2");
    h2.innerHTML = titleText;
    window.a11yMsgHeadings.appendChild(h2);

    div = document.createElement("div");
    div.innerHTML = msgText;
    window.a11yMsgHeadings.appendChild(div);
  }

  function addNodes () {
    var counter = 0;

    targetList.forEach(function (target) {
      var elements = document.querySelectorAll(target.selector);

      Array.prototype.forEach.call(elements, function (element) {
        var boundingRect = element.getBoundingClientRect();
        var overlayNode = createOverlay(target, boundingRect);
        var prefix = target.label + ": ";
        var textContent = utils.getElementText(element);
        overlayNode.title = prefix + textContent;
        document.body.appendChild(overlayNode);
        counter += 1;
      });
    });

    return counter;
  }

  function removeNodes () {
    var selector = "div." + className;
    var elements = document.querySelectorAll(selector);
    [].forEach.call(elements, function (element) {
      document.body.removeChild(element);
    });
  }

  window.accessibility = function (flag) {
    var count;

    window.a11yShowHeadings = (typeof flag === "undefined") ? true : !flag;
    if (window.a11yShowHeadings){
      count = addNodes();
      if (count === 0) showMessage();
    }
    else {
      hideMessage();
      removeNodes();
    }
  };

  window.onresize = function () { removeNodes(); window.a11yShowHeadings = false; };
  window.accessibility(window.a11yShowHeadings);
})(OAAUtils);

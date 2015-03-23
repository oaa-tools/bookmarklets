javascript: (function() {
  var targetList = [
    {selector: "h1", color: "navy",   label: "H1"},
    {selector: "h2", color: "olive",  label: "H2"},
    {selector: "h3", color: "purple", label: "H3"},
    {selector: "h4", color: "green",  label: "H4"},
    {selector: "h5", color: "gray",   label: "H5"},
    {selector: "h6", color: "brown",  label: "H6"}
  ];

  var className  = "a11yGfdXALm1";
  var zIndex = 100000;

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

  function createOverlay (tgt, rect) {
    var innerStyle = "float: right; background-color: " + tgt.color + "; padding: 2px 3px";
    var scrollOffsets = getScrollOffsets();
    var node = document.createElement("div");

    node.setAttribute("class", className);

    node.style.position = "absolute";
    node.style.overflow = "hidden";
    node.style.zIndex = zIndex;

    node.startLeft = (rect.left + scrollOffsets.x) + "px";
    node.startTop = (rect.top + scrollOffsets.y) + "px";

    node.style.left = node.startLeft;
    node.style.top = node.startTop;
    node.style.height = Math.max(rect.height, 27) + "px";
    node.style.width = rect.width + "px";

    node.style.boxSizing = "border-box";
    node.style.border = "3px solid " + tgt.color;
    node.style.color = "white";
    node.style.fontFamily = "Arial, Helvetica, 'Liberation Sans', sans-serif";
    node.style.fontSize = "16px";

    node.innerHTML = '<div style="' + innerStyle + '">' + tgt.label + '</div>';
    return node;
  }

  function addNodes () {
    targetList.forEach(function (target) {
      var elements = document.querySelectorAll(target.selector);

      [].forEach.call(elements, function (element) {
        var boundingRect = element.getBoundingClientRect();
        var overlayNode = createOverlay(target, boundingRect);
        document.body.appendChild(overlayNode);
      });
    });
  }

  function removeNodes () {
    var selector = "div." + className;
    var elements = document.querySelectorAll(selector);
    [].forEach.call(elements, function (element) {
      document.body.removeChild(element);
    });
  }

  window.accessibility = function (flag) {
    window.a11yShowHeadings = (typeof flag === "undefined") ? true : !flag;
    if (window.a11yShowHeadings) addNodes();
    else removeNodes();
  };

  window.onresize = function () { removeNodes(); window.a11yShowHeadings = false; };
  window.accessibility(window.a11yShowHeadings);
})();

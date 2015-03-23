javascript: (function() {
  var targetList = [
    {selector: "h1", color: "rgba(0, 0, 0, 0.2)",       label: "H1"},
    {selector: "h2", color: "rgba(235, 255, 47, 0.2)",  label: "H2"},
    {selector: "h3", color: "rgba(130, 0, 125, 0.2)",   label: "H3"},
    {selector: "h4", color: "rgba(0, 0, 125, 0.2)",     label: "H4"},
    {selector: "h5", color: "rgba(215, 116, 44, 0.2)",  label: "H5"},
    {selector: "h6", color: "rgba(215, 40, 40, 0.2)",   label: "H6"}
  ];

  var className  = "a11yGfdXALm1";

  function createOverlay (tgt, rect) {
    var innerStyle = "text-align: right; padding: 2px 4px";
    var node = document.createElement("div");

    node.setAttribute("class", className);
    node.style.position = "absolute";
    node.style.overflow = "hidden";
    node.style.zIndex = "999999";

    node.style.left = rect.left + "px";
    node.style.top = rect.top + "px";
    node.style.height = Math.max(rect.height, 27) + "px";
    node.style.width = rect.width + "px";

    node.style.border = "1px solid black";
    node.style.backgroundColor = tgt.color;
    node.style.color = "black";
    node.style.fontFamily = "Arial, Helvetica, 'Liberation Sans', sans-serif";
    node.style.fontSize = "18px";

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

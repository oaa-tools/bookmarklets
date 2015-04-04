(function (utils) {
  var targetList = [
    {selector: "h1", color: "navy",   label: "h1"},
    {selector: "h2", color: "olive",  label: "h2"},
    {selector: "h3", color: "purple", label: "h3"},
    {selector: "h4", color: "green",  label: "h4"},
    {selector: "h5", color: "gray",   label: "h5"},
    {selector: "h6", color: "brown",  label: "h6"}
  ];

  var selectors = targetList.map(function (tgt) {return tgt.selector;}).join(', ');
  var msgTitle  = "Headings";
  var msgText   = "No heading elements (" + selectors + ") found.";
  var className = "a11yGfdXALm1";
  var zIndex    = 100000;

  function addNodes () {
    var counter = 0;

    targetList.forEach(function (target) {
      var elements = document.querySelectorAll(target.selector);

      Array.prototype.forEach.call(elements, function (element) {
        var boundingRect = element.getBoundingClientRect();
        var overlayNode = utils.createOverlay(target, boundingRect, className);
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
    utils.hideMessage();
    window.a11yShowHeadings = (typeof flag === "undefined") ? true : !flag;
    if (window.a11yShowHeadings){
      if (addNodes() === 0) {
        utils.showMessage(msgTitle, msgText);
        window.a11yShowHeadings = false;
      }
    }
    else {
      removeNodes();
    }
  };

  window.onresize = function () {
    removeNodes();
    utils.resizeMessage();
    window.a11yShowHeadings = false;
  };

  window.accessibility(window.a11yShowHeadings);
})(OAAUtils);

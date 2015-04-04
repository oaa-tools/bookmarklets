(function (utils) {
  var targetList = [
    {selector: 'body > header, [role="banner"]',            color: "gray",   label: "banner"},
    {selector: 'main, [role="main"]',                       color: "navy",   label: "main"},
    {selector: 'body > footer, [role="contentinfo"]',       color: "olive",  label: "contentinfo"},
    {selector: 'aside:not([role]), [role="complementary"]', color: "brown",  label: "complementary"},
    {selector: 'nav, [role="navigation"]',                  color: "green",  label: "navigation"},
    {selector: '[role="search"]',                           color: "purple", label: "search"}
  ];

  var selectors = targetList.map(function (tgt) {return '<li>' + tgt.selector + '</li>';}).join('');
  var msgTitle  = "Landmarks";
  var msgText   = "No elements with ARIA Landmark roles found: <ul>" + selectors + "</ul>";
  var className = "a11yGfdXALm0";
  var zIndex    = 100000;

  function getAccessibleName (element) {
    var name;

    name = utils.getAttributeIdRefsValue(element, "aria-labelledby");
    if (name.length) return name;

    name = utils.getAttributeValue(element, "aria-label");
    if (name.length) return name;

    name = utils.getAttributeValue(element, "title");
    if (name.length) return name;

    return '';
  }

  function addNodes () {
    var counter = 0;

    targetList.forEach(function (target) {
      var elements = document.querySelectorAll(target.selector);
      var accessibleName;

      Array.prototype.forEach.call(elements, function (element) {
        var boundingRect = element.getBoundingClientRect();
        var overlayNode = utils.createOverlay(target, boundingRect, className);
        var text = getAccessibleName(element);
        accessibleName = text.length ?
          target.label + ": " + text :
          target.label;
        overlayNode.title = accessibleName;
        document.body.appendChild(overlayNode);
        counter += 1;
      });
    });

    return counter;
  }

  function removeNodes () {
    var selector = "div." + className;
    var elements = document.querySelectorAll(selector);
    Array.prototype.forEach.call(elements, function (element) {
      document.body.removeChild(element);
    });
  }

  window.accessibility = function (flag) {
    utils.hideMessage();
    window.a11yShowLandmarks = (typeof flag === "undefined") ? true : !flag;
    if (window.a11yShowLandmarks){
      if (addNodes() === 0) {
        utils.showMessage(msgTitle, msgText);
        window.a11yShowLandmarks = false;
      }
    }
    else {
      removeNodes();
    }
  };

  window.onresize = function () {
    removeNodes();
    utils.resizeMessage();
    window.a11yShowLandmarks = false;
  };

  window.accessibility(window.a11yShowLandmarks);
})(OAAUtils);

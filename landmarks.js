(function (utils) {
  var targetList = [
    {selector: 'body > header, [role="banner"]',            color: "gray",   label: "banner"},
    {selector: 'main, [role="main"]',                       color: "navy",   label: "main"},
    {selector: 'body > footer, [role="contentinfo"]',       color: "olive",  label: "contentinfo"},
    {selector: '[role="application"]',                      color: "teal",   label: "application"},
    {selector: 'aside:not([role]), [role="complementary"]', color: "brown",  label: "complementary"},
    {selector: 'nav, [role="navigation"]',                  color: "green",  label: "navigation"},
    {selector: '[role="search"]',                           color: "purple", label: "search"}
  ];

  var selectors = targetList.map(function (tgt) {return '<li>' + tgt.selector + '</li>';}).join('');
  var msgTitle  = "Landmarks";
  var msgText   = "No elements with ARIA Landmark roles found: <ul>" + selectors + "</ul>";
  var className = "a11yGfdXALm0";

  function getElementInfo (element) {
    var tagName = element.tagName.toLowerCase();
    var role = utils.getAttributeValue(element, 'role');
    return role.length ? tagName + ' [role="' + role + '"]' : tagName;
  }

  function getAccessibleName (element, target) {
    var name;

    name = utils.getAccessibleNameAria(element);
    if (name.length) return name;

    name = utils.getAttributeValue(element, "title");
    if (name.length) return name;

    return target.label;
  }

  function getTooltipText (element, target) {
    var elementInfo = getElementInfo(element);
    var accessibleName = getAccessibleName(element, target);
    return 'ELEMENT: ' + elementInfo + '\n' + 'ACC. NAME: ' + accessibleName;
  }

  window.accessibility = function (flag) {
    utils.hideMessage();
    window.a11yShowLandmarks = (typeof flag === "undefined") ? true : !flag;
    if (window.a11yShowLandmarks){
      if (utils.addNodes(targetList, className, getTooltipText) === 0) {
        utils.showMessage(msgTitle, msgText);
        window.a11yShowLandmarks = false;
      }
    }
    else {
      utils.removeNodes(className);
    }
  };

  window.addEventListener('resize', function (event) {
    utils.removeNodes(className);
    utils.resizeMessage();
    window.a11yShowLandmarks = false;
  });

  window.accessibility(window.a11yShowLandmarks);
})(OAAUtils);

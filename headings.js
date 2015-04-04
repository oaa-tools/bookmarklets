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

  function getTooltipText (element, target) {
    var textContent = utils.getElementText(element);
    return target.label + ": " + textContent;
  }

  window.accessibility = function (flag) {
    utils.hideMessage();
    window.a11yShowHeadings = (typeof flag === "undefined") ? true : !flag;
    if (window.a11yShowHeadings){
      if (utils.addNodes(targetList, className, getTooltipText) === 0) {
        utils.showMessage(msgTitle, msgText);
        window.a11yShowHeadings = false;
      }
    }
    else {
      utils.removeNodes(className);
    }
  };

  window.onresize = function () {
    utils.removeNodes(className);
    utils.resizeMessage();
    window.a11yShowHeadings = false;
  };

  window.accessibility(window.a11yShowHeadings);
})(OAAUtils);

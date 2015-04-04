(function (utils) {
  var targetList = [
    // {selector: "form",     color: "gray",   label: "form"},
    {selector: "input",    color: "navy",   label: "input"},
    {selector: "select",   color: "green",  label: "select"},
    {selector: "textarea", color: "brown",  label: "textarea"},
    {selector: "button",   color: "purple", label: "button"},
    {selector: "label",    color: "olive",  label: "label"},
    {selector: "fieldset", color: "maroon", label: "fieldset"},
    {selector: "output",   color: "teal",   label: "output"}
  ];

  var selectors = targetList.map(function (tgt) {return '<li>' + tgt.selector + '</li>';}).join('');
  var msgTitle  = "Form Elements";
  var msgText   = "No form-related elements found: <ul>" + selectors + "</ul>";
  var className = "a11yGfdXALm2";
  var zIndex    = 100000;

  function getAccessibleName (element) {
    var name;

    name = utils.getAttributeIdRefsValue(element, "aria-labelledby");
    if (name.length) return name;

    name = utils.getAttributeValue(element, "aria-label");
    if (name.length) return name;

    // Add label[for] && input[id] where for===id
    // Add [label  input] (label descendant)

    name = utils.getAttributeValue(element, "title");
    if (name.length) return name;

    return '';
  }

  function getElementLabel (element) {
    var tagName = element.tagName.toLowerCase();
    var id = element.id, type = element.type;
    var forVal, label = '';

    /*
    switch (element.type) {
      case 'button': case 'checkbox': case 'color': case 'date': case 'datetime': case 'email':
      case 'file': case 'hidden': case 'image': case 'month': case 'number': case 'password':
      case 'radio': case 'range': case 'reset': case 'search': case 'submit': case 'tel':
      case 'text': case 'time': case 'url': case 'week':
    }
    */

    switch (tagName) {
      case 'input':
        label = (type && type.length) ? tagName + ' [type="' + type + '"]' : tagName;
        break;
      case 'label':
        forVal = element.getAttribute('for');
        label = (forVal && forVal.length) ? tagName + ' [for="' + forVal + '"]' : tagName;
        break;
      default:
        label = tagName;
    }

    if (id && id.length)
      return label + ' [id="' + id + '"]';
    else
      return label;
  }

  function getTooltipText (element, target) {
    var text = getAccessibleName(element);
    var label = getElementLabel(element);
    return text.length ? label + "\n" + text : label;
  }

  window.accessibility = function (flag) {
    utils.hideMessage();
    window.a11yShowFormElements = (typeof flag === "undefined") ? true : !flag;
    if (window.a11yShowFormElements){
      if (utils.addNodes(targetList, className, getTooltipText) === 0) {
        utils.showMessage(msgTitle, msgText);
        window.a11yShowFormElements = false;
      }
    }
    else {
      utils.removeNodes(className);
    }
  };

  window.onresize = function () {
    utils.removeNodes(className);
    utils.resizeMessage();
    window.a11yShowFormElements = false;
  };

  window.accessibility(window.a11yShowFormElements);
})(OAAUtils);

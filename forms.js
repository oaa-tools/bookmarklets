(function (utils) {
  var targetList = [
    // {selector: "form",     color: "gray",   label: "form"},
    {selector: "fieldset", color: "gray",   label: "fieldset"},
    {selector: "legend",   color: "maroon", label: "legend"},
    {selector: "input",    color: "navy",   label: "input"},
    {selector: "select",   color: "green",  label: "select"},
    {selector: "textarea", color: "brown",  label: "textarea"},
    {selector: "output",   color: "teal",   label: "output"},
    {selector: "button",   color: "purple", label: "button"},
    {selector: "label",    color: "olive",  label: "label"}
  ];

  var selectors = targetList.map(function (tgt) {return '<li>' + tgt.selector + '</li>';}).join('');
  var msgTitle  = "Forms";
  var msgText   = "No form-related elements found: <ul>" + selectors + "</ul>";
  var className = "a11yGfdXALm2";

  function getAccessibleNameAria (element) {
    var name;

    name = utils.getAttributeIdRefsValue(element, 'aria-labelledby');
    if (name.length) return name;

    name = utils.getAttributeValue(element, 'aria-label');
    if (name.length) return name;

    return '';
  }

  function getAccessibleName (element, attributes) {
    var name;

    name = getAccessibleNameAria (element);
    if (name.length) return name;

    // fallback to attributes
    if (typeof attributes !== 'undefined') {
      attributes.forEach(function (attrib) {
        name = utils.getAttributeValue(element, attrib);
        if (name.length) return name;
      });
    }

    return '';
  }

  function getAccessibleNameUseLabel (element, attributes) {
    var name, label, id = element.id;

    name = getAccessibleNameAria (element);
    if (name.length) return name;

    // use label selector [for=id]
    if (id.length) {
      label = document.querySelector('[for="' + id + '"]');
      if (label) {
        name = utils.getElementText(label);
        if (name.length) return name;
      }
    }

    // use label encapsulation
    if (typeof element.closest === 'function') {
      label = element.closest('label');
      if (label) {
        name = utils.getElementText(label);
        if (name.length) return name;
      }
    }

    // fallback to attributes
    if (typeof attributes !== 'undefined') {
      attributes.forEach(function (attrib) {
        name = utils.getAttributeValue(element, attrib);
        if (name.length) return name;
      });
    }

    return '';
  }

  // Use for input type submit or reset
  function getAccessibleNameOrDefault (element, defValue) {
    var name;

    name = getAccessibleNameAria(element);
    if (name.length) return name;

    name = utils.getAttributeValue(element, 'value');
    if (name.length) return name;

    if (defValue && defValue.length) return defValue;

    name = utils.getAttributeValue(element, 'title');
    if (name.length) return name;

    return '';
  }

  function getAccessibleNameButton (element) {
    var name;

    name = getAccessibleNameAria(element);
    if (name.length) return name;

    name = utils.getElementText(element);
    if (name.length) return name;

    name = utils.getAttributeValue(element, 'title');
    if (name.length) return name;

    return '';
  }

  // needs to be recursive
  function addFieldsetLegend(element, accName) {
    var fieldset, legend, text;

    if (typeof element.closest === 'function') {
      fieldset = element.closest('fieldset');
      if (fieldset) {
        legend = fieldset.querySelector('legend');
        text = utils.getElementText(legend);
        if (text.length) return text + ' ' + accName;
      }
    }

    return accName;
  }

  function getElementInfoAndAccName (element) {
    var tagName = element.tagName.toLowerCase();
    var id = element.id, type = element.type;
    var elementInfo, accName, forVal;

    switch (tagName) {
      case 'input':
        elementInfo = (type && type.length) ? tagName + ' [type="' + type + '"]' : tagName + ' [type="text"]';
        if (id && id.length) elementInfo += ' [id="' + id + '"]';
        switch (type) {
          case 'text':
          case 'password':
          case 'search':
          case 'tel':
          case 'email':
          case 'url':
            accName = getAccessibleNameUseLabel(element, ['placeholder', 'title']);
            break;
          case 'image':
            accName = getAccessibleName(element, ['alt', 'value', 'title']);
            break;
          case 'button':
            accName = getAccessibleName(element, ['value', 'title']);
            break;
          case 'submit':
            accName = getAccessibleNameOrDefault(element, 'submit');
            break;
          case 'reset':
            accName = getAccessibleNameOrDefault(element, 'reset');
            break;
          default:
            accName = getAccessibleNameUseLabel(element, ['title']);
            break;
        }
        break;
      case 'textarea':
        elementInfo = tagName;
        if (id && id.length) elementInfo += ' [id="' + id + '"]';
        accName = getAccessibleNameUseLabel(element, ['placeholder', 'title']);
        break;
      case 'select':
      case 'output':
        elementInfo = tagName;
        if (id && id.length) elementInfo += ' [id="' + id + '"]';
        accName = getAccessibleNameUseLabel(element, ['title']);
        break;
      case 'button':
        elementInfo = tagName;
        accName = getAccessibleNameButton(element);
        break;
      case 'label':
        forVal = element.getAttribute('for');
        elementInfo = (forVal && forVal.length) ? tagName + ' [for="' + forVal + '"]' : tagName;
        accName = utils.getElementText(element);
        break;
      case 'legend':
        elementInfo = tagName;
        accName = utils.getElementText(element);
        break;
      default:
        elementInfo = tagName;
        accName = '';
    }

    switch (tagName) {
      case 'label':
      case 'legend':
        if (accName.length) accName = 'TEXT CONTENT: ' + accName;
        break;
      case 'form':
      case 'fieldset':
        break;
      default:
        accName = addFieldsetLegend(element, accName);
        if (accName.length) accName = 'ACCESSIBLE NAME: ' + accName;
        break;
    }

    elementInfo = 'ELEMENT INFO: ' + elementInfo;

    if (accName.length)
      return elementInfo + '\n' + accName;
    else
      return elementInfo;
  }

  function getTooltipText (element, target) {
    return getElementInfoAndAccName(element);
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

  window.addEventListener('resize', function (event) {
    utils.removeNodes(className);
    utils.resizeMessage();
    window.a11yShowFormElements = false;
  });

  window.accessibility(window.a11yShowFormElements);
})(OAAUtils);

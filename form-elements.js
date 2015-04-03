(function (utils) {
  var targetList = [
    // {selector: "form",     color: "gray",   label: "form"},
    {selector: "fieldset", color: "maroon", label: "fieldset"},
    {selector: "input",    color: "navy",   label: "input"},
    {selector: "select",   color: "green",  label: "select"},
    {selector: "textarea", color: "brown",  label: "textarea"},
    {selector: "button",   color: "purple", label: "button"},
    {selector: "label",    color: "olive",  label: "label"},
    {selector: "output",   color: "teal",   label: "output"}
  ];

  var msgTitle = "Form Elements";
  var msgText = "No form elements (form, input, select, textarea, button, label, fieldset, output) found.";
  var className  = "a11yGfdXALm3";
  var zIndex = 100000;

  function createOverlay (tgt, rect) {
    var innerStyle = "float: right; background-color: " + tgt.color + "; padding: 1px 1px 4px 4px";
    var node = document.createElement("div");
    var scrollOffsets = utils.getScrollOffsets();
    var minWidth  = 34;
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
    node.style.width  = Math.max(rect.width, minWidth) + "px";
    node.style.height = Math.max(rect.height, minHeight) + "px";

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
      return label + ' id="' + id + '"';
    else
      return label;
  }

  function addNodes () {
    var counter = 0;

    targetList.forEach(function (target) {
      var elements = document.querySelectorAll(target.selector);
      var accessibleName;

      Array.prototype.forEach.call(elements, function (element) {
        var boundingRect = element.getBoundingClientRect();
        var overlayNode = createOverlay(target, boundingRect);
        var text = getAccessibleName(element);
        var label = getElementLabel(element);
        accessibleName = text.length ? label + "\n" + text : label;
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
    window.a11yShowFormElements = (typeof flag === "undefined") ? true : !flag;
    if (window.a11yShowFormElements){
      if (addNodes() === 0) {
        utils.showMessage(msgTitle, msgText);
        window.a11yShowFormElements = false;
      }
    }
    else {
      removeNodes();
    }
  };

  window.onresize = function () {
    removeNodes();
    utils.resizeMessage();
    window.a11yShowFormElements = false;
  };

  window.accessibility(window.a11yShowFormElements);
})(OAAUtils);

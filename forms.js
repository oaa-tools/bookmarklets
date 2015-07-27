/*
*   forms.js: bookmarklet script for highlighting form-related elements
*/

import Bookmarklet from './Bookmarklet';
import { formsCss } from './utils/dom';
import {
  getAccessibleNameAria,
  getAttributeValue,
  getElementText
} from './utils/accname';

(function () {
  let targetList = [
    // {selector: "form",     color: "silver",   label: "form"},
    {selector: "output",   color: "teal",   label: "output"},
    {selector: "fieldset", color: "gray",   label: "fieldset"},
    {selector: "legend",   color: "maroon", label: "legend"},
    {selector: "label",    color: "olive",  label: "label"},
    {selector: "input",    color: "navy",   label: "input"},
    {selector: "select",   color: "green",  label: "select"},
    {selector: "textarea", color: "brown",  label: "textarea"},
    {selector: "button",   color: "purple", label: "button"}
  ];

  let selectors = targetList.map(function (tgt) {return '<li>' + tgt.selector + '</li>';}).join('');

  function getAccessibleNameUseAttributes (element, attributes) {
    let name;

    name = getAccessibleNameAria(element);
    if (name.length) return name;

    if (typeof attributes !== 'undefined') {
      for (let attr of attributes) {
        name = getAttributeValue(element, attr);
        if (name.length) return name;
      }
    }

    name = getAttributeValue(element, 'title');
    if (name.length) return name;

    return '';
  }

  function getAccessibleNameUseLabel (element, attributes) {
    let name, label;

    name = getAccessibleNameAria(element);
    if (name.length) return name;

    // use label selector [for=id]
    if (element.id) {
      label = document.querySelector('[for="' + element.id + '"]');
      if (label) {
        name = getElementText(label);
        if (name.length) return name;
      }
    }

    // use label encapsulation
    if (typeof element.closest === 'function') {
      label = element.closest('label');
      if (label) {
        name = getElementText(label);
        if (name.length) return name;
      }
    }

    // fallback to attributes
    if (typeof attributes !== 'undefined') {
      for (let attr of attributes) {
        name = getAttributeValue(element, attr);
        if (name.length) return name;
      }
    }

    name = getAttributeValue(element, 'title');
    if (name.length) return name;

    return '';
  }

  // Use for input type submit or reset
  function getAccessibleNameOrDefault (element, defValue) {
    let name;

    name = getAccessibleNameAria(element);
    if (name.length) return name;

    name = getAttributeValue(element, 'value');
    if (name.length) return name;

    if (defValue && defValue.length) return defValue;

    name = getAttributeValue(element, 'title');
    if (name.length) return name;

    return '';
  }

  function getAccessibleNameButton (element) {
    let name;

    name = getAccessibleNameAria(element);
    if (name.length) return name;

    name = getElementText(element);
    if (name.length) return name;

    name = getAttributeValue(element, 'title');
    if (name.length) return name;

    return '';
  }

  function addFieldsetLegend (element, accName) {
    let fieldset, legend, text, name;

    if (typeof element.closest === 'function') {
      fieldset = element.closest('fieldset');
      if (fieldset) {
        legend = fieldset.querySelector('legend');
        if (legend) {
          text = getElementText(legend);
          if (text.length)
            name = text + ' ' + accName;
          else
            name = accName;
        }
        else {
          name = accName;
        }
        return addFieldsetLegend(fieldset.parentNode, name);
      }
    }

    return accName;
  }

  function getElementInfoAndAccName (element) {
    let tagName = element.tagName.toLowerCase(),
        id      = element.id,
        type    = element.type,
        elementInfo, accName, forVal;

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
            accName = getAccessibleNameUseLabel(element, ['placeholder']);
            break;
          case 'image':
            accName = getAccessibleNameUseAttributes(element, ['alt', 'value']);
            break;
          case 'button':
            accName = getAccessibleNameUseAttributes(element, ['value']);
            break;
          case 'submit':
            accName = getAccessibleNameOrDefault(element, 'Submit');
            break;
          case 'reset':
            accName = getAccessibleNameOrDefault(element, 'Reset');
            break;
          default:
            accName = getAccessibleNameUseLabel(element);
            break;
        }
        break;
      case 'textarea':
        elementInfo = tagName;
        if (id && id.length) elementInfo += ' [id="' + id + '"]';
        accName = getAccessibleNameUseLabel(element, ['placeholder']);
        break;
      case 'select':
      case 'output':
        elementInfo = tagName;
        if (id && id.length) elementInfo += ' [id="' + id + '"]';
        accName = getAccessibleNameUseLabel(element);
        break;
      case 'button':
        elementInfo = tagName;
        accName = getAccessibleNameButton(element);
        break;
      case 'label':
        forVal = element.getAttribute('for');
        elementInfo = (forVal && forVal.length) ? tagName + ' [for="' + forVal + '"]' : tagName;
        accName = getElementText(element);
        break;
      case 'legend':
        elementInfo = tagName;
        accName = getElementText(element);
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
        if (accName.length) accName = 'ACC. NAME: ' + accName;
        break;
    }

    elementInfo = 'ELEMENT: ' + elementInfo;

    if (accName.length)
      return elementInfo + '\n' + accName;
    else
      return elementInfo;
  }

  function getInfo (element, target) {
    return getElementInfoAndAccName(element);
  }

  let params = {
    msgTitle:   "Forms",
    msgText:    "No form-related elements found: <ul>" + selectors + "</ul>",
    targetList: targetList,
    cssClass:   formsCss,
    getInfo:    getInfo,
    dndFlag:    true
  };

  let blt = new Bookmarklet("a11yForms", params);
  blt.run();
})();

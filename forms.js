/*
*   forms.js: bookmarklet script for highlighting form-related elements
*/

import Bookmarklet from './Bookmarklet';
import {
  getAttributeValue,
  getElementText,
  getAccessibleNameAria,
  getAccessibleNameUseContents,
  getAccessibleNameUseAttributes
} from './utils/accname';
import { formsCss } from './utils/dom';
import { formatInfo } from './utils/utils';

(function () {
  let targetList = [
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

// HIGHER-LEVEL ACCESSIBLE NAME FUNCTIONS THAT RETURN AN OBJECT WITH SOURCE PROPERTY

  function getAccessibleNameUseLabel (element, attributes) {
    let name, label;

    name = getAccessibleNameAria(element);
    if (name) return name;

    // use label selector [for=id]
    if (element.id) {
      label = document.querySelector('[for="' + element.id + '"]');
      if (label) {
        name = getElementText(label);
        if (name.length) return { name: name, source: 'label[for=id]' };
      }
    }

    // use label encapsulation
    if (typeof element.closest === 'function') {
      label = element.closest('label');
      if (label) {
        name = getElementText(label);
        if (name.length) return { name: name, source: 'label container' };
      }
    }

    // fall back to attributes
    if (typeof attributes !== 'undefined') {
      for (let attr of attributes) {
        name = getAttributeValue(element, attr);
        if (name.length) return { name: name, source: attr };
      }
    }

    name = getAttributeValue(element, 'title');
    if (name.length) return { name: name, source: 'title' };

    return null;
  }

  // Use for input type submit or reset
  function getAccessibleNameUseDefault (element, defValue) {
    let name;

    name = getAccessibleNameAria(element);
    if (name) return name;

    name = getAttributeValue(element, 'value');
    if (name.length) return { name: name, source: 'value' };

    if (defValue && defValue.length) return { name: defValue, source: 'default' };

    name = getAttributeValue(element, 'title');
    if (name.length) return { name: name, source: 'title' };

    return null;
  }

  function getAccessibleNameButton (element) {
    let name;

    name = getAccessibleNameAria(element);
    if (name) return name;

    name = getElementText(element);
    if (name.length) return { name: name, source: 'contents' };

    name = getAttributeValue(element, 'title');
    if (name.length) return { name: name, source: 'title' };

    return null;
  }

  function addFieldsetLegend (element, accName) {
    let fieldset, legend, text;

    if (typeof element.closest === 'function') {
      fieldset = element.closest('fieldset');
      if (fieldset) {
        legend = fieldset.querySelector('legend');
        if (legend) {
          text = getElementText(legend);
          if (text.length) {
            accName.name = text + ' ' + accName.name;
            accName.source = 'fieldset/legend + ' + accName.source;
          }
        }
        return addFieldsetLegend(fieldset.parentNode, accName);
      }
    }

    return accName;
  }

  function getInfo (element, target) {
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
            accName = getAccessibleNameUseDefault(element, 'Submit');
            break;
          case 'reset':
            accName = getAccessibleNameUseDefault(element, 'Reset');
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
        accName = getAccessibleNameUseContents(element);
        break;
      case 'legend':
        elementInfo = tagName;
        accName = getAccessibleNameUseContents(element);
        break;
      default:
        elementInfo = tagName;
        accName = null;
    }

    switch (tagName) {
      case 'fieldset':
      case 'label':
      case 'legend':
        break;
      default:
        accName = addFieldsetLegend(element, accName);
        break;
    }

    let info = {
      title: 'FORM INFO',
      element: elementInfo,
      accName: accName
    };

    return formatInfo(info);
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

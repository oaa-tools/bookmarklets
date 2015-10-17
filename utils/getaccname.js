/*
*   getaccname.js
*/

import {
  getElementContents,
  nameFromAriaLabel,
  nameFromContents,
  nameFromAttribute,
  nameFromAltAttribute,
  nameFromLabelElement,
  nameFromTitleElement
} from './namefrom';

/*
*   addFieldsetLegend: Recursively prepend legend contents of closest
*   fieldset ancestor to the accName, which may already have content.
*/
function addFieldsetLegend (element, accName) {
  let fieldset, legend, text;

  if (typeof element.closest === 'function') {
    fieldset = element.closest('fieldset');
    if (fieldset) {
      legend = fieldset.querySelector('legend');
      if (legend) {
        text = getElementContents(legend);
        if (text.length) {
          if (accName) {
            accName.name = text + ' ' + accName.name;
            accName.source = 'fieldset/legend + ' + accName.source;
          }
          else {
            accName = { name: text, source: 'fieldset/legend' };
          }
        }
      }
      return addFieldsetLegend(fieldset.parentNode, accName);
    }
  }

  return accName;
}

/*
*   handleLabelableElements: Handle labelable elements if nested in
*   fieldset with legend.
*/
function handleLabelableElements (element, accName) {
  let tagName = element.tagName.toLowerCase();

  switch (tagName) {
    case 'input':
      if (element.type !== 'hidden')
        accName = addFieldsetLegend(element, accName);
      break;
    case 'button':
    case 'keygen':
    case 'meter':
    case 'output':
    case 'progress':
    case 'select':
    case 'textarea':
      accName = addFieldsetLegend(element, accName);
      break;
  }

  return accName;
}

/*
*   nameFromNativeSemantics: Use method appropriate to the native
*   semantics of element to find accessible name. Includes methods
*   for all interactive elements, and for non-interactive elements
*   defaults to nameFromContents.
*/
export function nameFromNativeSemantics (element) {
  let tagName = element.tagName.toLowerCase(),
      accName = null;

  switch (tagName) {
    // FORM ELEMENTS
    case 'input':
      switch (element.type) {
        // DO NOTHING FOR TYPE HIDDEN
        case 'hidden':
          break;

        // TEXT FIELDS
        case 'email':
        case 'search':
        case 'tel':
        case 'text':
        case 'url':
          accName = nameFromLabelElement(element);
          if (accName === null) accName = nameFromAttribute(element, 'placeholder');
          break;

        // OTHER INPUT TYPES
        case 'button':
          accName = nameFromAttribute(element, 'value');
          break;

        case 'reset':
          accName = nameFromAttribute(element, 'value');
          if (accName === null) accName = { name: 'Reset', source: 'default' };
          break;

        case 'submit':
          accName = nameFromAttribute(element, 'value');
          if (accName === null) accName = { name: 'Submit', source: 'default' };
          break;

        case 'image':
          accName = nameFromAltAttribute(element);
          if (accName === null) accName = nameFromAttribute(element, 'value');
          break;

        default:
          accName = nameFromLabelElement(element);
          break;
      }
      break;

    // FORM ELEMENTS (CONT.)
    case 'button':
      accName = nameFromContents(element);
      break;

    case 'label':
      accName = nameFromContents(element);
      break;

    case 'keygen':
    case 'meter':
    case 'output':
    case 'progress':
    case 'select':
      accName = nameFromLabelElement(element);
      break;

    case 'textarea':
      accName = nameFromLabelElement(element);
      if (accName === null) accName = nameFromAttribute(element, 'placeholder');
      break;

    // EMBEDDED ELEMENTS
    case 'audio': // if 'controls' attribute is present
      accName = { name: 'NOT YET IMPLEMENTED', source: '' };
      break;

    case 'embed':
      accName = { name: 'NOT YET IMPLEMENTED', source: '' };
      break;

    case 'iframe':
      accName = nameFromAttribute(element, 'title');
      break;

    case 'img':
    case 'area': // added
      accName = nameFromAltAttribute(element);
      break;

    case 'object':
      accName = { name: 'NOT YET IMPLEMENTED', source: '' };
      break;

    case 'svg': // added
      accName = nameFromTitleElement(element);
      break;

    case 'video': // if 'controls' attribute is present
      accName = { name: 'NOT YET IMPLEMENTED', source: '' };
      break;

    // OTHER INTERACTIVE ELEMENTS
    case 'a':
      accName = nameFromContents(element);
      break;

    case 'details':
      accName = { name: 'NOT YET IMPLEMENTED', source: '' };
      break;

    // ALL OTHER ELEMENTS
    default:
      accName = nameFromContents(element);
      break;
  }

  // LAST RESORT USE TITLE
  if (accName === null) accName = nameFromAttribute(element, 'title');

  return accName;
}

/*
*   nameFromAriaLabelledBy: Get the aria-labelledby attribute value of the
*   element param (a space-separated list of IDREFs), visit each referenced
*   element in the order it appears in the list and obtain its accessible
*   name (skipping recursive aria-labelledby calculations), and return an
*   object with name property set to a space-separated string concatenation
*   of those results if any, otherwise return null.
*/
function nameFromAriaLabelledBy (element) {
  var value = element.getAttribute('aria-labelledby');
  var idRefs, i, refElement, accName, arr = [];

  if (value && value.length) {
    idRefs = value.split(' ');

    for (i = 0; i < idRefs.length; i++) {
      refElement = document.getElementById(idRefs[i]);
      accName = getAccessibleName(refElement, true);
      if (accName && accName.name.length) arr.push(accName.name);
    }
  }

  if (arr.length)
    return { name: arr.join(' '), source: 'aria-labelledby' };

  return null;
}

/*
*   getAccessibleName: Use ARIA Roles Model specification for accessible
*   name calculation based on precedence order: (1) Use aria-labelledby,
*   unless we are already in the midst of a recursive aria-labelledby
*   calculation; (2) use aria-label; (3) use whatever method is specified
*   by the native semantics of the element, which includes, at the bottom
*   of the precedence list, use of the title attribute.
*/
export function getAccessibleName (element, recFlag = false) {
  var accName = null;

  if (!recFlag) accName = nameFromAriaLabelledBy(element);
  if (accName === null) accName = nameFromAriaLabel(element);
  if (accName === null) accName = nameFromNativeSemantics(element);

  accName = handleLabelableElements(element, accName);

  return accName;
}

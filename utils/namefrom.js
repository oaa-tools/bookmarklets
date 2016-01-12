/*
*   namefrom.js
*/

import { isEmbeddedControl, getEmbeddedControlValue } from './embedded';

// LOW-LEVEL FUNCTIONS

/*
*   normalize: Trim leading and trailing whitespace and condense all
*   interal sequences of whitespace to a single space. Adapted from
*   Mozilla documentation on String.prototype.trim polyfill. Handles
*   BOM and NBSP characters.
*/
export function normalize (s) {
  let rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
  return s.replace(rtrim, '').replace(/\s+/g, ' ');
}

/*
*   getAttributeValue: Return attribute value if present on element,
*   otherwise return empty string.
*/
export function getAttributeValue (element, attribute) {
  let value = element.getAttribute(attribute);
  return (value === null) ? '' : normalize(value);
}

/*
*   couldHaveAltText: Based on HTML5 specification, determine whether
*   element could have an 'alt' attribute.
*/
function couldHaveAltText (element) {
  let tagName = element.tagName.toLowerCase();

  switch (tagName) {
    case 'img':
    case 'area':
      return true;
    case 'input':
      return (element.type && element.type === 'image');
  }

  return false;
}

/*
*   hasEmptyAltText: Determine whether the alt attribute is present
*   and its value is the empty string.
*/
export function hasEmptyAltText (element) {
  let value = element.getAttribute('alt');

   // Attribute is present
  if (value !== null)
    return (normalize(value).length === 0);

  return false;
}

/*
*   isLabelableElement: Based on HTML5 specification, determine whether
*   element can be associated with a label.
*/
export function isLabelableElement (element) {
  let tagName = element.tagName.toLowerCase(),
      type    = element.type;

  switch (tagName) {
    case 'input':
      return (type !== 'hidden');
    case 'button':
    case 'keygen':
    case 'meter':
    case 'output':
    case 'progress':
    case 'select':
    case 'textarea':
      return true;
    default:
      return false;
  }
}

/*
*   addCssGeneratedContent: Add CSS-generated content for pseudo-elements
*   :before and :after. According to the CSS spec, test that content value
*   is other than the default computed value of 'none'.
*
*   Note: Even if an author specifies content: 'none', because browsers add
*   the double-quote character to the beginning and end of computed string
*   values, the result cannot and will not be equal to 'none'.
*/
function addCssGeneratedContent (element, contents) {
  let result = contents,
      prefix = getComputedStyle(element, ':before').content,
      suffix = getComputedStyle(element, ':after').content;

  if (prefix !== 'none') result = prefix + result;
  if (suffix !== 'none') result = result + suffix;

  return result;
}

/*
*   getNodeContents: Recursively process element and text nodes by aggregating
*   their text values for an ARIA text equivalent calculation.
*   1. This includes special handling of elements with 'alt' text and embedded
*      controls.
*   2. The forElem parameter is needed for label processing to avoid inclusion
*      of an embedded control's value when the label is for the control itself.
*/
function getNodeContents (node, forElem) {
  let contents = '';

  if (node === forElem) return '';

  switch (node.nodeType) {
    case Node.ELEMENT_NODE:
      if (couldHaveAltText(node)) {
        contents = getAttributeValue(node, 'alt');
      }
      else if (isEmbeddedControl(node)) {
        contents = getEmbeddedControlValue(node);
      }
      else {
        if (node.hasChildNodes()) {
          let children = node.childNodes,
              arr = [];

          for (let i = 0; i < children.length; i++) {
            let nc = getNodeContents(children[i], forElem);
            if (nc.length) arr.push(nc);
          }

          contents = (arr.length) ? arr.join(' ') : '';
        }
      }
      // For all branches of the ELEMENT_NODE case...
      contents = addCssGeneratedContent(node, contents);
      break;

    case Node.TEXT_NODE:
      contents = normalize(node.textContent);
  }

  return contents;
}

/*
*   getElementContents: Construct the ARIA text alternative for element by
*   processing its element and text node descendants and then adding any CSS-
*   generated content if present.
*/
export function getElementContents (element, forElement) {
  let result = '';

  if (element.hasChildNodes()) {
    let children = element.childNodes,
        arrayOfStrings = [];

    for (let i = 0; i < children.length; i++) {
      let contents = getNodeContents(children[i], forElement);
      if (contents.length) arrayOfStrings.push(contents);
    }

    result = (arrayOfStrings.length) ? arrayOfStrings.join(' ') : '';
  }

  return addCssGeneratedContent(element, result);
}

/*
*   getContentsOfChildNodes: Using predicate function for filtering element
*   nodes, collect text content from all child nodes of element.
*/
function getContentsOfChildNodes (element, predicate) {
  let arr = [], content;

  Array.prototype.forEach.call(element.childNodes, function (node) {
    switch (node.nodeType) {
      case (Node.ELEMENT_NODE):
        if (predicate(node)) {
          content = getElementContents(node);
          if (content.length) arr.push(content);
        }
        break;
      case (Node.TEXT_NODE):
        content = normalize(node.textContent);
        if (content.length) arr.push(content);
        break;
    }
  });

  if (arr.length) return arr.join(' ');
  return '';
}

// HIGHER-LEVEL FUNCTIONS THAT RETURN AN OBJECT WITH SOURCE PROPERTY

/*
*   nameFromAttribute
*/
export function nameFromAttribute (element, attribute) {
  let name;

  name = getAttributeValue(element, attribute);
  if (name.length) return { name: name, source: attribute };

  return null;
}

/*
*   nameFromAltAttribute
*/
export function nameFromAltAttribute (element) {
  let name = element.getAttribute('alt');

  // Attribute is present
  if (name !== null) {
    name = normalize(name);
    return (name.length) ?
      { name: name, source: 'alt' } :
      { name: '<empty>', source: 'alt' };
  }

  // Attribute not present
  return null;
}

/*
*   nameFromContents
*/
export function nameFromContents (element) {
  let name;

  name = getElementContents(element);
  if (name.length) return { name: name, source: 'contents' };

  return null;
}

/*
*   nameFromDefault
*/
export function nameFromDefault (name) {
  return name.length ? { name: name, source: 'default' } : null;
}

/*
*   nameFromDescendant
*/
export function nameFromDescendant (element, tagName) {
  let descendant = element.querySelector(tagName);
  if (descendant) {
    let name = getElementContents(descendant);
    if (name.length) return { name: name, source: tagName + ' element' };
  }

  return null;
}

/*
*   nameFromLabelElement
*/
export function nameFromLabelElement (element) {
  let name, label;

  // label [for=id]
  if (element.id) {
    label = document.querySelector('[for="' + element.id + '"]');
    if (label) {
      name = getElementContents(label, element);
      if (name.length) return { name: name, source: 'label [for=id]' };
    }
  }

  // label encapsulation
  if (typeof element.closest === 'function') {
    label = element.closest('label');
    if (label) {
      name = getElementContents(label, element);
      if (name.length) return { name: name, source: 'label container' };
    }
  }

  return null;
}

/*
*   nameFromDetailsOrSummary: If element is expanded (has open attribute),
*   return the contents of the summary element followed by the text contents
*   of element and all of its non-summary child elements. Otherwise, return
*   only the contents of the first summary element descendant.
*/
export function nameFromDetailsOrSummary (element) {
  let name, summary;

  function isExpanded (elem) { return elem.hasAttribute('open'); }

  // At minimum, always use summary contents
  summary = element.querySelector('summary');
  if (summary) name = getElementContents(summary);

  // Return either summary + details (non-summary) or summary only
  if (isExpanded(element)) {
    name += getContentsOfChildNodes(element, function (elem) {
      return elem.tagName.toLowerCase() !== 'summary';
    });
    if (name.length) return { name: name, source: 'contents' };
  }
  else {
    if (name.length) return { name: name, source: 'summary element' };
  }

  return null;
}

/*
*   namefrom.js
*/

// LOW-LEVEL FUNCTIONS

/*
*   normalize: Trim leading and trailing whitespace and condense all
*   interal sequences of whitespace to a single space. Adapted from
*   Mozilla documentation on String.prototype.trim polyfill. Handles
*   BOM and NBSP characters.
*/
function normalize (s) {
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
  let val = element.getAttribute('alt'); // if not present, returns null
  if (val !== null) return (normalize(val).length === 0);

  return false;
}

/*
*   isTextField: Based on HTML5 specification, determine whether element
*   is a text field, which could have a user-provided value.
*/
function isTextField (element) {
  let tagName = element.tagName.toLowerCase(),
      type    = element.type;

  switch (tagName) {
    case 'input':
      switch (type) {
        case 'email':
        case 'search':
        case 'tel':
        case 'text':
        case 'url':
          return true;

        default:
          return false;
      }
      break;

    case 'textarea':
      return true;
  }

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
*   getElementContents: Construct the text alternative for element by
*   collecting all text node descendants, along with the 'alt' text of
*   element and all of its element descendants.
*/
export function getElementContents (element) {
  let arrayOfStrings;

  function getContentsRec (node, arr) {
    let altText, content;

    switch (node.nodeType) {
      case (Node.ELEMENT_NODE):
        if (couldHaveAltText(node)) {
          altText = getAttributeValue(node, 'alt');
          if (altText.length) arr.push(altText);
        }
        else {
          if (node.hasChildNodes()) {
            Array.prototype.forEach.call(node.childNodes, function (n) {
              getContentsRec(n, arr);
            });
          }
        }
        break;
      case (Node.TEXT_NODE):
        content = normalize(node.textContent);
        if (content.length) arr.push(content);
        break;
      default:
        break;
    }

    return arr;
  }

  arrayOfStrings = getContentsRec(element, []);
  if (arrayOfStrings.length) return arrayOfStrings.join(' ');

  return '';
}

/*
*   getLabelContents: Construct the text alternative for element by
*   collecting all text node descendants, along with the 'alt' text and
*   text field values of element and all of its element descendants.
*/
export function getLabelContents (element) {
  let arrayOfStrings;

  function getContentsRec (node, arr) {
    let altText, value, content;

    switch (node.nodeType) {
      case (Node.ELEMENT_NODE):
        if (couldHaveAltText(node)) {
          altText = getAttributeValue(node, 'alt');
          if (altText.length) arr.push(altText);
        }
        else if (isTextField(node)) {
          value = normalize(node.value);
          if (value.length) arr.push(value);
        }
        else {
          if (node.hasChildNodes()) {
            Array.prototype.forEach.call(node.childNodes, function (n) {
              getContentsRec(n, arr);
            });
          }
        }
        break;
      case (Node.TEXT_NODE):
        content = normalize(node.textContent);
        if (content.length) arr.push(content);
        break;
      default:
        break;
    }

    return arr;
  }

  arrayOfStrings = getContentsRec(element, []);
  if (arrayOfStrings.length) return arrayOfStrings.join(' ');

  return '';
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
*   nameFromAriaLabel
*/
export function nameFromAriaLabel (element) {
  let name;

  name = getAttributeValue(element, 'aria-label');
  if (name.length) return { name: name, source: 'aria-label' };

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
*   nameFromLabelElement
*/
export function nameFromLabelElement (element) {
  let name, label;

  // label [for=id]
  if (element.id) {
    label = document.querySelector('[for="' + element.id + '"]');
    if (label) {
      name = getLabelContents(label);
      if (name.length) return { name: name, source: 'label [for=id]' };
    }
  }

  // label encapsulation
  if (typeof element.closest === 'function') {
    label = element.closest('label');
    if (label) {
      name = getLabelContents(label);
      if (name.length) return { name: name, source: 'label container' };
    }
  }

  return null;
}

/*
*   nameFromTitleElement
*/
export function nameFromTitleElement (element) {
  let name, title;

  title = element.querySelector('title');
  if (title) {
    name = getElementContents(title);
    if (name.length) return { name: name, source: 'title element' };
  }

  return null;
}

/*
*   nameFromDetailsOrSummary: If element is expanded (has open attribute),
*   return the contents of the summary element followed by the text contents
*   of element and all of its non-summary child elements. Otherwise, return
*   only the contents of the first summary element child.
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

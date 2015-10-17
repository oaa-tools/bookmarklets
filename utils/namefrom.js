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
function getAttributeValue (element, attribute) {
  var value = element.getAttribute(attribute);
  return (value === null) ? '' : normalize(value);
}

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

function isTextField (element) {
  var tagName = element.tagName.toLowerCase(),
      type;

  switch (tagName) {
    case 'input':
      type = element.type;
      switch (type) {
        case 'text':
        case 'password':
        case 'search':
        case 'tel':
        case 'email':
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
*   getElementContents: Recursively collect, in document order, all text
*   nodes, along with all 'alt' text of 'img' and 'area' elements, starting
*   with element and then visiting all of its descendants. Return a string
*   whose value is the space-separated concatenation of that content.
*/
export function getElementContents (element) {
  var arrayOfStrings;

  function getContentsRec (node, arr) {
    var altText, content;

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

export function getLabelContents (element) {
  var arrayOfStrings;

  function getContentsRec (node, arr) {
    var altText, value, content;

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

// HIGHER-LEVEL FUNCTIONS THAT RETURN AN OBJECT WITH SOURCE PROPERTY

export function nameFromAriaLabel (element) {
  var name;

  name = getAttributeValue(element, 'aria-label');
  if (name.length) return { name: name, source: 'aria-label' };

  return null;
}

export function nameFromContents (element) {
  var name;

  name = getElementContents(element);
  if (name.length) return { name: name, source: 'contents' };

  return null;
}

export function nameFromAttribute (element, attribute) {
  var name;

  name = getAttributeValue(element, attribute);
  if (name.length) return { name: name, source: attribute };

  return null;
}

export function nameFromAltAttribute (element) {
  let name;

  // Detect whether attribute is present
  name = element.getAttribute('alt');
  if (name !== null) {
    name = normalize(name);
    return (name.length) ?
      { name: name, source: 'alt' } :
      { name: '<empty>', source: 'alt' };
  }

  // Attribute not present
  return null;
}

export function nameFromLabelElement (element) {
  let name, label;

  // label[for=id]
  if (element.id) {
    label = document.querySelector('[for="' + element.id + '"]');
    if (label) {
      name = getLabelContents(label);
      if (name.length) return { name: name, source: 'label[for=id]' };
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

export function nameFromTitleElement (element) {
  let name, title;

  title = element.querySelector('title');
  if (title) {
    name = getElementContents(title);
    if (name.length) return { name: name, source: 'title element' };
  }

  return null;
}

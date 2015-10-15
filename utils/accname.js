/*
*   accname.js: Functions for retrieving accessible name content
*/

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
  var value = element.getAttribute(attribute);
  return (value === null) ? '' : normalize(value);
}

/*
*   getElementText: Recursively collect, in document order, all text nodes
*   along with all 'alt' text of 'img' and 'area' elements of element and
*   its descendants and return a string whose value is the space-separated
*   concatenation of that content.
*/
export function getElementText (element) {
  var arrayOfStrings;

  function getTextRec (node, arr) {
    var tagName, altText, content;

    switch (node.nodeType) {
      case (Node.ELEMENT_NODE):
        tagName = node.tagName.toLowerCase();
        if (tagName === 'img' || tagName === 'area') {
          altText = getAttributeValue(node, 'alt');
          if (altText.length) arr.push(altText);
        }
        else {
          if (node.hasChildNodes()) {
            Array.prototype.forEach.call(node.childNodes, function (n) {
              getTextRec(n, arr);
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

  arrayOfStrings = getTextRec(element, []);
  if (arrayOfStrings.length)
    return arrayOfStrings.join(' ');
  return '';
}

/*
*   getRefElementAccessibleName: Get text content from element and
*   if that is empty, get its title attribute value, and if that is
*   null or empty return an empty string.
*/
function getRefElementAccessibleName (element) {
  var textContent;

  if (element === null) return '';

  textContent = getElementText(element);
  if (textContent) return textContent;

  if (element.title) return normalize(element.title);
  return '';
}

/*
*   getAttributeIdRefsValue: Get the IDREFS value of specified attribute
*   and return the concatenated string based on referencing each of the
*   IDREF values. See getRefElementAccessibleName
*/
function getAttributeIdRefsValue (element, attribute) {
  var value = element.getAttribute(attribute);
  var idRefs, i, refElement, accName, text = [];

  if (value && value.length) {
    idRefs = value.split(' ');

    for (i = 0; i < idRefs.length; i++) {
      refElement = document.getElementById(idRefs[i]);
      accName = getRefElementAccessibleName(refElement);
      if (accName.length) text.push(accName);
    }
  }

  if (text.length) return text.join(' ');
  return '';
}

// HIGHER-LEVEL FUNCTIONS THAT RETURN AN OBJECT WITH SOURCE PROPERTY

/*
*   getAccessibleNameAria: The attributes that take precedence over all
*   other associations in determining an accessible name for an element
*/
export function getAccessibleNameAria (element) {
  var name;

  name = getAttributeIdRefsValue(element, 'aria-labelledby');
  if (name.length) return { name: name, source: 'aria-labelledby'};

  name = getAttributeValue(element, 'aria-label');
  if (name.length) return { name: name, source: 'aria-label'};

  return null;
}

/*
*   getAccessibleName: Use ARIA accessible name calculation algorithm
*   to retrieve accessible name from sources in order of precedence
*/
export function getAccessibleName (element) {
  var name;

  name = getAccessibleNameAria(element);
  if (name) return name;

  name = getAttributeValue(element, 'title');
  if (name.length) return { name: name, source: 'title'};

  return null;
}

/*
*   getAccessibleNameUseContent: Fall back to using element text content
*   for elements that permit accessible name to come from content.
*/
export function getAccessibleNameUseContent (element) {
  var name;

  name = getAccessibleName(element);
  if (name) return name;

  name = getElementText(element);
  if (name.length) return { name: name, source: 'content'};

  return null;
}

/*
*   getAccessibleNameUseAttributes: Use algorithm similar to getAccessibleName
*   but interject use of specified attributes before using 'title' attribute.
*/

export function getAccessibleNameUseAttributes (element, attributes) {
  var name;

  name = getAccessibleNameAria(element);
  if (name) return name;

  if (typeof attributes !== 'undefined') {
    for (let attr of attributes) {
      name = getAttributeValue(element, attr);
      if (name.length) return { name: name, source: attr};
    }
  }

  name = getAttributeValue(element, 'title');
  if (name.length) return { name: name, source: 'title'};

  return null;
}

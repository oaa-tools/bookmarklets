/*
*   info.js: Function for displaying information on highlighted elements
*/

import { getAttributeValue, isLabelableElement } from './namefrom';

/*
*   getElementInfo: Extract tagName and other attribute information
*   based on tagName and return as formatted string.
*/
export function getElementInfo (element) {
  let tagName = element.tagName.toLowerCase(),
      elementInfo = tagName;

  if (tagName === 'input') {
    let type = element.type;
    if (type && type.length) elementInfo += ' [type="' + type + '"]';
  }

  if (tagName === 'label') {
    let forVal = getAttributeValue(element, 'for');
    if (forVal.length) elementInfo += ' [for="' + forVal + '"]';
  }

  if (isLabelableElement(element)) {
    let id = element.id;
    if (id && id.length) elementInfo += ' [id="' + id + '"]';
  }

  if (element.hasAttribute('role')) {
    let role = getAttributeValue(element, 'role');
    if (role.length) elementInfo += ' [role="' + role + '"]';
  }

  return elementInfo;
}

/*
*   formatInfo: Convert info properties into a string with line breaks.
*/
export function formatInfo (info) {
  let value = '';
  let { title, element, accName, role, props } = info;

  value += '=== ' + title + ' ===';
  if (element) value += '\nELEMENT: ' + element;
  if (accName) {
    value += '\nACC. NAME: ' + accName.name + '\nFROM: ' + accName.source;
  }
  if (role) value += '\nARIA ROLE: ' + role;
  if (props) value += '\nPROPERTIES: ' + props;

  return value;
}

/*
*   embedded.js
*/

import { getAriaRole } from './roles';
import { getAttributeValue, normalize } from './namefrom';

// LOW-LEVEL FUNCTIONS

/*
*   getInputValue: Get current value of 'input' or 'textarea' element.
*/
function getInputValue (element) {
  return normalize(element.value);
}

/*
*   getRangeValue: Get current value of control with role 'spinbutton'
*   or 'slider' (i.e., subclass of abstract 'range' role).
*/
function getRangeValue (element) {
  let value;

  value = getAttributeValue(element, 'aria-valuetext');
  if (value.length) return value;

  value = getAttributeValue(element, 'aria-valuenow');
  if (value.length) return value;

  return getInputValue(element);
}

// HELPER FUNCTIONS FOR SPECIFIC ROLES

function getTextboxValue (element) {
  let inputTypes = ['email', 'password', 'search', 'tel', 'text', 'url'],
      tagName = element.tagName.toLowerCase(),
      type    = element.type;

  if (tagName === 'input' && inputTypes.indexOf(type) !== -1) {
    return getInputValue(element);
  }

  if (tagName === 'textarea') {
    return getInputValue(element);
  }

  return '';
}

function getComboboxValue (element) {
  let inputTypes = ['email', 'search', 'tel', 'text', 'url'],
      tagName = element.tagName.toLowerCase(),
      type    = element.type;

  if (tagName === 'input' && inputTypes.indexOf(type) !== -1) {
    return getInputValue(element);
  }

  return '';
}

function getSliderValue (element) {
  let tagName = element.tagName.toLowerCase(),
      type    = element.type;

  if (tagName === 'input' && type === 'range') {
    return getRangeValue(element);
  }

  return '';
}

function getSpinbuttonValue (element) {
  let tagName = element.tagName.toLowerCase(),
      type    = element.type;

  if (tagName === 'input' && type === 'number') {
    return getRangeValue(element);
  }

  return '';
}

function getListboxValue (element) {
  let tagName = element.tagName.toLowerCase();

  if (tagName === 'select') {
    let arr = [], selectedOptions = element.selectedOptions;

    for (let i = 0; i < selectedOptions.length; i++) {
      let option = selectedOptions[i];
      let value = normalize(option.value);
      if (value.length) arr.push(value);
    }

    if (arr.length) return arr.join(' ');
  }

  return '';
}

/*
*   isEmbeddedControl: Determine whether element has a role that corresponds
*   to an HTML form control that could be embedded within text content.
*/
export function isEmbeddedControl (element) {
  let embeddedControlRoles = [
    'textbox',
    'combobox',
    'listbox',
    'slider',
    'spinbutton'
  ];
  let role = getAriaRole(element);

  return (embeddedControlRoles.indexOf(role) !== -1);
}

/*
*   getEmbeddedControlValue: Based on the role of element, use native semantics
*   of HTML to get the corresponding text value of the embedded control.
*/
export function getEmbeddedControlValue (element) {
  let role = getAriaRole(element);

  switch (role) {
    case 'textbox':
      return getTextboxValue(element);

    case 'combobox':
      return getComboboxValue(element);

    case 'listbox':
      return getListboxValue(element);

    case 'slider':
      return getSliderValue(element);

    case 'spinbutton':
      return getSpinbuttonValue(element);
  }

  return '';
}

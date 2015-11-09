/*
*   roles.js
*
*   Note: The information in this module is based on the following documents:
*   1. ARIA in HTML (https://specs.webplatform.org/html-aria/webspecs/master/)
*   2. WAI-ARIA 1.1 (http://www.w3.org/TR/wai-aria-1.1/)
*   3. WAI-ARIA 1.0 (http://www.w3.org/TR/wai-aria/)
*/

import { isDescendantOf, hasParentWithName } from './dom';
import { getAttributeValue, hasEmptyAltText } from './namefrom';

/*
*   inListOfOptions: Determine whether element is a child of
*   1. a select element
*   2. an optgroup element that is a child of a select element
*   3. a datalist element
*/
function inListOfOptions (element) {
  let parent = element.parentElement,
      parentName = parent.tagName.toLowerCase(),
      parentOfParentName = parent.parentElement.tagName.toLowerCase();

  if (parentName === 'select')
    return true;

  if (parentName === 'optgroup' && parentOfParentName === 'select')
    return true;

  if (parentName === 'datalist')
    return true;

  return false;
}

/*
*   validRoles: Reference list of all concrete ARIA roles as specified in
*   WAI-ARIA 1.1 Working Draft of 14 July 2015
*/
const validRoles = [

  // LANDMARK
  'application',
  'banner',
  'complementary',
  'contentinfo',
  'form',
  'main',
  'navigation',
  'search',

  // WIDGET
  'alert',
  'alertdialog',
  'button',
  'checkbox',
  'dialog',
  'gridcell',
  'link',
  'log',
  'marquee',
  'menuitem',
  'menuitemcheckbox',
  'menuitemradio',
  'option',
  'progressbar',
  'radio',
  'scrollbar',
  'searchbox',             // ARIA 1.1
  'slider',
  'spinbutton',
  'status',
  'switch',                // ARIA 1.1
  'tab',
  'tabpanel',
  'textbox',
  'timer',
  'tooltip',
  'treeitem',

  // COMPOSITE WIDGET
  'combobox',
  'grid',
  'listbox',
  'menu',
  'menubar',
  'radiogroup',
  'tablist',
  'tree',
  'treegrid',

  // DOCUMENT STRUCTURE
  'article',
  'cell',                  // ARIA 1.1
  'columnheader',
  'definition',
  'directory',
  'document',
  'group',
  'heading',
  'img',
  'list',
  'listitem',
  'math',
  'none',                  // ARIA 1.1
  'note',
  'presentation',
  'region',
  'row',
  'rowgroup',
  'rowheader',
  'separator',
  'table',                 // ARIA 1.1
  'text',                  // ARIA 1.1
  'toolbar'
];

/*
*   getValidRole: Examine each value in space-separated list by attempting
*   to find its match in the validRoles array. If a match is found, return
*   it. Otherwise, return null.
*/
export function getValidRole (spaceSepList) {
  let arr = spaceSepList.split(' ');

  for (let i = 0; i < arr.length; i++) {
    let value = arr[i].toLowerCase();
    let validRole = validRoles.find(role => role === value);
    if (validRole) return validRole;
  }

  return null;
}

/*
*   getAriaRole: Get the value of the role attribute, if it is present. If
*   not specified, get the default role of element if it has one. Based on
*   ARIA in HTML as of 21 October 2015.
*/
export function getAriaRole (element) {
  let tagName = element.tagName.toLowerCase(),
      type    = element.type;

  if (element.hasAttribute('role')) {
    return getValidRole(getAttributeValue(element, 'role'));
  }

  switch (tagName) {

    case 'a':
      if (element.hasAttribute('href'))
        return 'link';
      break;

    case 'area':
      if (element.hasAttribute('href'))
        return 'link';
      break;

    case 'article':     return 'article';
    case 'aside':       return 'complementary';
    case 'body':        return 'document';
    case 'button':      return 'button';
    case 'datalist':    return 'listbox';
    case 'details':     return 'group';
    case 'dialog':      return 'dialog';
    case 'dl':          return 'list';
    case 'fieldset':    return 'group';

    case 'footer':
      if (!isDescendantOf(element, ['article', 'section']))
        return 'contentinfo';
      break;

    case 'form':        return 'form';

    case 'h1':          return 'heading';
    case 'h2':          return 'heading';
    case 'h3':          return 'heading';
    case 'h4':          return 'heading';
    case 'h5':          return 'heading';
    case 'h6':          return 'heading';

    case 'header':
      if (!isDescendantOf(element, ['article', 'section']))
        return 'banner';
      break;

    case 'hr':          return 'separator';

    case 'img':
      if (!hasEmptyAltText(element))
        return 'img';
      break;

    case 'input':
      if (type === 'button')    return 'button';
      if (type === 'checkbox')  return 'checkbox';
      if (type === 'email')     return (element.hasAttribute('list')) ? 'combobox' : 'textbox';
      if (type === 'image')     return 'button';
      if (type === 'number')    return 'spinbutton';
      if (type === 'password')  return 'textbox';
      if (type === 'radio')     return 'radio';
      if (type === 'range')     return 'slider';
      if (type === 'reset')     return 'button';
      if (type === 'search')    return (element.hasAttribute('list')) ? 'combobox' : 'textbox';
      if (type === 'submit')    return 'button';
      if (type === 'tel')       return (element.hasAttribute('list')) ? 'combobox' : 'textbox';
      if (type === 'text')      return (element.hasAttribute('list')) ? 'combobox' : 'textbox';
      if (type === 'url')       return (element.hasAttribute('list')) ? 'combobox' : 'textbox';
      break;

    case 'li':
      if (hasParentWithName(element, ['ol', 'ul']))
        return 'listitem';
      break;

    case 'link':
      if (element.hasAttribute('href'))
        return 'link';
      break;

    case 'main':      return 'main';

    case 'menu':
      if (type === 'toolbar')
        return 'toolbar';
      break;

    case 'menuitem':
      if (type === 'command')   return 'menuitem';
      if (type === 'checkbox')  return 'menuitemcheckbox';
      if (type === 'radio')     return 'menuitemradio';
      break;

    case 'meter':       return 'progressbar';
    case 'nav':         return 'navigation';
    case 'ol':          return 'list';

    case 'option':
      if (inListOfOptions(element))
        return 'option';
      break;

    case 'output':      return 'status';
    case 'progress':    return 'progressbar';
    case 'section':     return 'region';
    case 'select':      return 'listbox';
    case 'summary':     return 'button';

    case 'tbody':       return 'rowgroup';
    case 'tfoot':       return 'rowgroup';
    case 'thead':       return 'rowgroup';

    case 'textarea':    return 'textbox';

    // TODO: th can have role 'columnheader' or 'rowheader'
    case 'th':          return 'columnheader';

    case 'ul':          return 'list';
  }

  return null;
}

/*
*   nameFromIncludesContents: Determine whether the ARIA role of element
*   specifies that its 'name from' includes 'contents'.
*/
export function nameFromIncludesContents (element) {
  let elementRole = getAriaRole(element);
  if (elementRole === null) return false;

  let contentsRoles = [
    'button',
    'cell',                // ARIA 1.1
    'checkbox',
    'columnheader',
    'directory',
    'gridcell',
    'heading',
    'link',
    'listitem',
    'menuitem',
    'menuitemcheckbox',
    'menuitemradio',
    'option',
    'radio',
    'row',
    'rowgroup',
    'rowheader',
    'switch',              // ARIA 1.1
    'tab',
    'text',                // ARIA 1.1
    'tooltip',
    'treeitem'
  ];

  let contentsRole = contentsRoles.find(role => role === elementRole);
  return (typeof contentsRole !== 'undefined');
}

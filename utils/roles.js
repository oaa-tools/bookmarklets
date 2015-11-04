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
*   getValidRole: For each value in space-separated list, if it matches a
*   valid ARIA role, return that role. Otherwise, if there are no matches
*   return null.
*/
export function getValidRole (spaceSepList) {
  let arr = spaceSepList.split(' ');

  for (let i = 0; i < arr.length; i++) {
    switch (arr[i]) {

      // WIDGET
      case 'alert':
      case 'alertdialog':
      case 'button':
      case 'checkbox':
      case 'dialog':
      case 'gridcell':
      case 'link':
      case 'log':
      case 'marquee':
      case 'menuitem':
      case 'menuitemcheckbox':
      case 'menuitemradio':
      case 'option':
      case 'progressbar':
      case 'radio':
      case 'scrollbar':
      case 'searchbox':         // ARIA 1.1
      case 'slider':
      case 'spinbutton':
      case 'status':
      case 'switch':            // ARIA 1.1
      case 'tab':
      case 'tabpanel':
      case 'textbox':
      case 'timer':
      case 'tooltip':
      case 'treeitem':

      // COMPOSITE WIDGET
      case 'combobox':
      case 'grid':
      case 'listbox':
      case 'menu':
      case 'menubar':
      case 'radiogroup':
      case 'tablist':
      case 'tree':
      case 'treegrid':

      // DOCUMENT STRUCTURE
      case 'article':
      case 'cell':              // ARIA 1.1
      case 'columnheader':
      case 'definition':
      case 'directory':
      case 'document':
      case 'group':
      case 'heading':
      case 'img':
      case 'list':
      case 'listitem':
      case 'math':
      case 'none':              // ARIA 1.1
      case 'note':
      case 'presentation':
      case 'region':
      case 'row':
      case 'rowgroup':
      case 'rowheader':
      case 'separator':
      case 'table':             // ARIA 1.1
      case 'text':              // ARIA 1.1
      case 'toolbar':

      // LANDMARK
      case 'application':
      case 'banner':
      case 'complementary':
      case 'contentinfo':
      case 'form':
      case 'main':
      case 'navigation':
      case 'search':
        return arr[i];

      default:
        break;
    }
  } // END LOOP

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
*   nameFromIncludesContents: Determine whether element has an ARIA role
*   with a nameFrom property the includes 'contents'.
*/
export function nameFromIncludesContents (element) {
  let role = getAriaRole(element);
  if (role === null) return false;

  switch (role) {
    case 'button':
    case 'cell':                // ARIA 1.1
    case 'checkbox':
    case 'columnheader':
    case 'directory':
    case 'gridcell':
    case 'heading':
    case 'link':
    case 'listitem':
    case 'menuitem':
    case 'menuitemcheckbox':
    case 'menuitemradio':
    case 'option':
    case 'radio':
    case 'row':
    case 'rowgroup':
    case 'rowheader':
    case 'switch':              // ARIA 1.1
    case 'tab':
    case 'text':                // ARIA 1.1
    case 'tooltip':
    case 'treeitem':
      return true;
    default:
      return false;
  }
}

/*
*   roles.js
*/

import { isDescendantOf } from './dom';
import { getAttributeValue } from './namefrom';

export function getAriaRole (element) {
  let tagName = element.tagName.toLowerCase(),
      type    = element.type;

  if (element.hasAttribute('role'))
    return getAttributeValue(element, 'role');

  switch (tagName) {
    case 'a':
    case 'area':
      return 'link';
    case 'article':
      return 'article';
    case 'aside':
      return 'complementary';
    case 'body':
      return 'document';
    case 'button':
      return 'button';
    case 'datalist':
      return 'listbox';
    case 'fieldset':
      return 'group';

    case 'footer':
      if (!isDescendantOf(element, ['article', 'section']))
        return 'contentinfo';
      break;

    case 'header':
      if (!isDescendantOf(element, ['article', 'section']))
        return 'banner';
      break;

    case 'hr':
      return 'separator';
    case 'img':
      return 'img';

    case 'input':
      if (type === 'button' || type === 'image')
        return 'button';
      if (type === 'checkbox')
        return 'checkbox';
      if (type === 'radio')
        return 'radio';
      break;

    case 'li':
      return 'listitem';
    case 'link':
      return 'link';
    case 'main':
      return 'main';
    case 'menu':
      return 'toolbar';
    case 'nav':
      return 'navigation';
    case 'ol':
      return 'list';
    case 'option':
      return 'option';
    case 'output':
      return 'status';
    case 'progress':
      return 'progressbar';
    case 'section':
      return 'region';
    case 'select':
      return 'listbox';
    case 'textarea':
      return 'textbox';
    case 'ul':
      return 'list';
  }

  return null;
}

export function nameFromIncludesContents (element) {
  let role = getAriaRole(element);
  if (role === null) return false;

  switch (role) {
    case 'button':
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
    case 'tab':
    case 'tooltip':
    case 'treeitem':
      return true;
    default:
      return false;
  }
}

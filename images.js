/*
*   images.js: bookmarklet script for highlighting images.
*/

import Bookmarklet from './Bookmarklet';
import { normalize, getElementText, getAccessibleNameAria } from './utils/accname';
import { imagesCss } from './utils/dom';
import { formatInfo } from './utils/utils';

(function (utils) {
  let targetList = [
    {selector: "area", color: "teal",   label: "area"},
    {selector: "img",  color: "olive",  label: "img"},
    {selector: "svg",  color: "purple", label: "svg"}
  ];

  let selectors = targetList.map(function (tgt) {return tgt.selector;}).join(', ');

  function getRole (element) {
    let role = element.getAttribute('role');
    if (role !== null) return (role.length) ? role + ' (author)' : '<empty>';

    let tagname = element.tagName.toLowerCase();
    switch (tagname) {
      case 'area':
        let href = element.getAttribute('href');
        return (href && href.length) ? 'link' : '';
      case 'img':
        return 'img';
      case 'svg':
        return '';
    }

    return '';
  }

  function getAccessibleNameUseAlt (element) {
    let name, alt;

    name = getAccessibleNameAria(element);
    if (name) return name;

    alt = element.getAttribute('alt');
    if (alt !== null) {
      alt = normalize(alt);
      return (alt.length) ?
        { name: normalize(alt), source: 'alt' } :
        { name: '<empty>', source: 'alt' };
    }

    return null;
  }

  function getAccessibleNameUseTitleElement (element) {
    let name, title;

    name = getAccessibleNameAria(element);
    if (name) return name;

    title = element.querySelector('title');
    if (title) return { name: getElementText(title), source: 'title element' };

    return null;
  }

  function getInfo (element, target) {
    let tagName = element.tagName.toLowerCase(),
        accName;

    switch (tagName) {
      case 'area':
      case 'img':
        accName = getAccessibleNameUseAlt(element);
        break;
      case 'svg':
        accName = getAccessibleNameUseTitleElement(element);
        break;
    }

    let info = {
      title: 'IMAGE INFO',
      accName: accName,
      role: getRole(element)
    };

    return formatInfo(info);
  }

  let params = {
    msgTitle: "Images",
    msgText: "No image elements (" + selectors + ") found.",
    targetList: targetList,
    cssClass: imagesCss,
    getInfo: getInfo,
    dndFlag: true
  };

  let blt = new Bookmarklet("a11yImages", params);
  blt.run();
})();

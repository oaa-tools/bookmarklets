import { addNodes, removeNodes } from './utils/dom';
import * as dialog from './utils/dialog';

export default class {
  constructor (globalName, params) {
    // use singleton pattern
    if (typeof window[globalName] === 'object')
      return window[globalName];

    this.cssClass = params.cssClass;
    this.msgTitle = params.msgTitle;
    this.msgText  = params.msgText;
    this.params   = params;
    this.show     = false;

    window.addEventListener('resize', event => {
      removeNodes(this.cssClass);
      dialog.resize();
      this.show = false;
    });

    window[globalName] = this;
  }

  run () {
    dialog.hide();
    this.show = !this.show;
    if (this.show) {
      if (addNodes(this.params) === 0) {
        dialog.show(this.msgTitle, this.msgText);
        this.show = false;
      }
    }
    else {
      removeNodes(this.cssClass);
    }
  }
}

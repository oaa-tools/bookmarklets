## Notes on Refactoring with ES6 Features

June 2015

The codebase was refactored to utilize the Babel transpiler and webpack module bundler.

Babel enables the use of ES6 (a.k.a. ECMAScript 2015) features such as:

* modules
* classes
* arrow functions
* destructuring

The webpack npm package:

* allows you to specify module loaders to use for the build process
* handles module dependencies
* produces minified output files and, optionally, embedded CSS

By breaking down the code into smaller modules that group related functions, the objective is a codebase that will be easier to maintain and enhance with new functionality.

### Notes

* What was `oaa-utils.js` has been broken down into five separate modules in the `utils` directory: `accname.js`, `dialog.js`, `dom.js`, `overlay.js` and `utils.js`.
* The main logic for toggling between adding and removing the overlays in each top-level bookmarklet file has been moved to the `run` method of the `Bookmarklet` class (see module `Bookmarklet.js`).
* The CSS file `oaa-utils.css` has been renamed to `styles.css`.
* By using the Babel transpiler, the JavaScript code can be written in the recently finalized ECMAScript 2015 (ES6) syntax.
* Using the webpack module bundler, each output bookmarklet file is now minified and has a size of approx. 8-10 KB.
* Changes to the `index.html` file have cut down on the number of times the scripts and CSS file are injected into each page (once for each bookmarklet).

The main motivation for this refactoring was better modularity and a codebase that will more easily support the creation of bookmarklets with less of a cookie-cutter approach, and instead one that allows each bookmarklet to be built based on the unique functionality that it specifically needs.

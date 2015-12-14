Development Guide - Getting Started

Go to the parent directory under which the working copy will be created:

  $ cd <parent-directory>

Create the working copy of the repository with the 'git clone' command:

  $ git clone https://github.com/oaa-tools/bookmarklets.git

Change directory to the working copy:

  $ cd bookmarklets

Install all of the dev. dependencies using the 'npm install' command, which
does so by following the directives in the package.json file:

  $ npm install

Start coding...

When you're ready to do a build (using webpack), use the following command:

  $ npm run build

See the webpack.config.js file for more info on what the build will produce.

You can control whether webpack outputs minified JavaScript by editing the
package.json file: 'webpack -p' -> minified 'production-ready' output, and
just plain 'webpack' -> non-minified JavaScript.

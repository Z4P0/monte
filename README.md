# monte

web project starter

[Getting Started](#getting-started)
[Documentation](#documentation)
[Commands](#commands)



## Getting started

```bash
$ npm install     # install dependencies, postinstall runs: npm run build
$ npm run server  # view the web page
```

For development
```bash
$ npm run dev     # watch scss, jade, js files. run http-server and live-server
```

To create an exportable folder
```bash
$ npm run export  # creates an export/ directory with minified files
```
[More commands](#commands)


## Documentation

High-level overview
- HTML is compiled using jade templates
- CSS is autoprefixed and compiled from scss files
- JS is written in CommonJS format and compiled with Browserify
- File changes trigger new builds during development

Project is viewable at local ports :8080 and :4040
- http-server runs on port 8080
- live-server runs on port 4040

Check out package.json for list of dependencies


### Commands

These are defined in the `scripts` object in package.json. They are invoked with `npm run <command name>`
Some notable ones are:
```bash
$ npm run dev           # watch scss, jade, js files. run http-server and live-server
$ npm run html          # shortcut to call jade
$ npm run css           # compile and autoprefix the css
$ npm run js            # shortcut to call browserify
$ npm run watch         # watch all source files
$ npm run build         # build the things
$ npm run server        # run just the http-server
$ npm run live-reload   # run just the live-reload server
$ npm run servers       # run http-server and live-server
$ npm run export        # creates an export/ directory with minified files
```
Check out package.json for the full list of script commands

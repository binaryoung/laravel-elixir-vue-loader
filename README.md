# laravel-elixir-vue-loader

Simple extension to laravel elixir for building vue single page application depend on vue-loader.

[![NPM](https://nodei.co/npm/laravel-elixir-vue-loader.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/laravel-elixir-vue-loader/)

## Install

```
npm install --save-dev laravel-elixir-vue-loader
```

## Usage

### Basic Example

Within your main Gulpfile, add:

```javascript
var elixir = require('laravel-elixir');

require('laravel-elixir-vue-loader');

elixir(function(mix) {
    mix.vue('app.js');
});
```
### Watching Assets For Changes

Just run:
```
gulp watch
```
Any change of your entry file or your Vue components "*.vue" will automatically be compiled.Cool,hah?

### Custom Webpack Config

Also you can pass your custom webpack config to the second argument of the vue function.
For example,you want to use sass in your app,you can do this:

```javascript
elixir(function(mix) {
    mix.vue('app.js', {
        module: {
          loaders: [
            {test: /\.scss$/, loader: 'style!css!autoprefixer!sass'},
          ],
        },
    });
});
```
Definitely you need to install the sass loader first.

This extension also support webpack.config.js.Just put your webpack.config.js in laravel app root path.It works :)

###Setting an output file

```javascript
elixir(function(mix) {
    mix.vue('app.js', {}, './your-public-path/app.js');
});
```

## Issues

Feel free to report bugs or suggestions on issue page.

##Let The Code Fly ~ :tada:

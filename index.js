var fs = require('fs');
var gulp = require('gulp');
var Elixir = require('laravel-elixir');
var _ = require('underscore');
var webpack = require('webpack-stream');
var UglifyJsPlugin = require('webpack').optimize.UglifyJsPlugin;
var named = require('vinyl-named');

var $ = Elixir.Plugins;
var config = Elixir.config;

Elixir.extend('vue', function (src, webpackConfig, output) {

    var paths = prepGulpPaths(src, output);

    var webpackConfig = handleWebpackConfig(webpackConfig, paths);

    new Elixir.Task('vue', function () {
        this.log(paths.src, paths.output);

        return (
            gulp
                .src(paths.src.path)
                .pipe($.if(_.isArray(paths.src.path), named()))
                .pipe(webpack(webpackConfig))
                .on('error', function (e) {
                    new Elixir.Notification('Vue application Compilation Failed!');

                    this.emit('end');
                })
                .pipe(gulp.dest(paths.output.baseDir))
                .pipe(new Elixir.Notification('Vue application Compiled!'))
        );
    })
        .watch(paths.src.path)
        .watch([
            config.assetsPath + '/js/**/*.vue',
            config.assetsPath + '/js/**/**/*.vue',
        ])
        .ignore(paths.output.path);
});

/**
 * Prep the Gulp src and output paths.
 *
 * @param {string|array} src
 * @param {string|null}  output
 * @return {object}
 */
var prepGulpPaths = function (src, output) {
    return new Elixir.GulpPaths()
        .src(src, config.get('assets.js.folder'))
        .output(output || config.get('public.js.outputFolder'), 'app.js');
};

/**
 * Handle webpack config such as sourcemaps and
 * minification or user's cunstom webpack config.
 *
 * @param {object} options
 * @return {object}
 */
var handleWebpackConfig = function (webpackConfig, paths) {

    var defaultWebpackConfig = {
        output: {
            filename: paths.output.name,
        },
        module: {
            loaders: [
                {
                    test: /\.vue$/,
                    loader: 'vue'
                },
            ]
        },
    };

    if (fs.existsSync('webpack.config.js')) {
        var customWebpackConfig = require('./../../webpack.config.js');
        defaultWebpackConfig = _.extend(defaultWebpackConfig, customWebpackConfig);
    }

    webpackConfig = _.extend(defaultWebpackConfig, webpackConfig);

    if (!_.contains(webpackConfig.module.loaders, {test: /\.vue$/, loader: 'vue'})) {
        webpackConfig.module.loaders.push({
            test: /\.vue$/,
            loader: 'vue'
        });
    }

    if (config.sourcemaps) {
        webpackConfig = _.defaults(
            webpackConfig,
            {devtool: '#source-map'}
        );
    }

    if (config.production) {
        var currPlugins = _.isArray(webpackConfig.plugins) ? webpackConfig.plugins : [];
        webpackConfig.plugins = currPlugins.concat([new UglifyJsPlugin({sourceMap: false})]);
    }

    return webpackConfig;
}

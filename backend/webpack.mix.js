const mix = require("laravel-mix");

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix
    .js(
        [
            "resources/js/backend/before.js",
            "resources/js/backend/app.js",
            "resources/js/backend/after.js",
        ],
        "js/backend.js"
    )
    .react()
    .sass("resources/sass/backend/app.scss", "css/backend.css")
    .extract(["jquery", "bootstrap", "popper.js", "sweetalert2"]);

mix.webpackConfig({
    optimization: {
        providedExports: false,
        sideEffects: false,
        usedExports: false
    },
    watchOptions: {ignored: /node_modules/}
});


if (mix.inProduction()) {
    mix
        .options({
            // Optimize JS minification process
            terser: {
                cache: true,
                parallel: true,
                sourceMap: true,
            },
        })
        .version();
} else {
    mix
        .webpackConfig({
            devtool: "inline-source-map",
        })
        .browserSync({
            proxy: '127.0.0.1:8000',
        });
}

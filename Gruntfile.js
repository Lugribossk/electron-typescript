/*global module, require*/
"use strict";
let webpack = require("webpack");

module.exports = grunt => {
    grunt.initConfig({});

    let pkg = grunt.file.readJSON("package.json");

    let nodeModules = {};
    Object.keys(pkg.dependencies)
        .concat(Object.keys(pkg.devDependencies))
        .forEach(name => {
            nodeModules[name] = "commonjs " + name;
        });

    require("grunt-webpack/tasks/webpack")(grunt);
    grunt.config.set("webpack", {
        options: {
            resolve: {
                // Add '.ts' and '.tsx' as resolvable extensions.
                extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
            },
            target: "electron",
            node: {
                __filename: true,
                __dirname: true
            },
            externals: nodeModules
        },
        app: {
            context: "src",
            entry: {
                main: "./index.ts"
            },
            module: {
                loaders: [{
                    loader: "ts-loader",
                    test: /\.tsx?$/
                }]
            },
            output: {
                path: "target/app-js",
                filename: "index.js",
                pathinfo: true
            },
            plugins: [
                new webpack.optimize.UglifyJsPlugin({
                    minimize: true,
                    // Remove all comments.
                    comments: /a^/g,
                    compress: {
                        warnings: false
                    }
                })
            ]
        },
        test: {
            devtool: "source-map",
            entry: grunt.file.expand("test/**/*Test.ts")
                .concat(["test/testSetup.ts"])
                .map(path => "./" + path),
            module: {
                preLoaders: [{
                    loader: "source-map-loader",
                    test: /\.js$/
                }],
                loaders: [{
                    loader: "ts-loader",
                    test: /\.tsx?$/
                }]
            },
            output: {
                path: "target",
                filename: "tests.js",
                pathinfo: true
            }
        }
    });

    grunt.registerTask("app-dependencies", "Install app dependencies separately", function () {
        let done = this.async();
        grunt.file.write("target/app-js/package.json", JSON.stringify({
            dependencies: pkg.dependencies
        }));

        grunt.util.spawn({
            cmd: "npm",
            args: ["install"],
            opts: {
                cwd: "target/app-js"
            }
        }, done);
    });

    require("grunt-electron/tasks/electron")(grunt);
    grunt.config.set("electron", {
        app: {
            options: {
                name: "app",
                dir: "target/app-js",
                platform: "win32",
                arch: "x64",
                version: pkg.devDependencies["electron-prebuilt"],
                overwrite: true,
                out: "target",
                asar: true,
                "app-version": pkg.version,
                "build-version": pkg.version
            }
        }
    });

    grunt.registerTask("electron-builder-config", "Create electron-builder config file.", () => {
        grunt.file.write("target/electron-builder.json", JSON.stringify({
            win: {
                title: pkg.productName,
                icon: "installer/icon.ico",
                version: pkg.version,
                publisher: "Blah",
                nsiTemplate: "installer/installer.nsi"
            }
        }));
        grunt.file.mkdir("target/app-installer");
    });

    require("grunt-electron-builder-wrapper/tasks/electron-builder")(grunt);
    grunt.config.set("electron-builder", {
        installer: {
            options: {
                appPath: "target/app-win32-x64",
                out: "target/app-installer",
                platform: "win",
                config: "target/electron-builder.json"
            }
        }
    });

    require("grunt-contrib-clean/tasks/clean")(grunt);
    grunt.config.set("clean", {
        app: ["target/app-*"]
    });

    require("grunt-mocha-test/tasks/mocha-test")(grunt);
    let testSrc = ["target/tests.js"];
    grunt.config.set("mochaTest", {
        dev: {
            src: testSrc
        },
        ci: {
            options: {
                reporter: "xunit",
                captureFile: "target/TEST-tests.xml",
                quiet: true
            },
            src: testSrc
        }
    });

    let lintSrc = ["src/**/*.ts", "test/**/*.ts"];
    require("grunt-tslint/tasks/tslint")(grunt);
    grunt.config.set("tslint", {
        dev: {
            src: lintSrc
        }
        // ci: {
        //     options: {
        //         formatter: "junit",
        //         formattersDirectory: "TODO",
        //         outputFile: "target/TEST-lint.xml"
        //     },
        //     src: lintSrc
        // }
    });

    grunt.registerTask("test", ["tslint:dev", "webpack:test", "mochaTest:dev"]);
    grunt.registerTask("test-ci", ["tslint:dev", "webpack:test", "mochaTest:ci"]);
    grunt.registerTask("executable", ["clean:app", "webpack:app", "app-dependencies", "electron:app"]);
    grunt.registerTask("installer", ["executable", "electron-builder-config", "electron-builder:installer"]);
};

# Purpose

The project in this repository demonstrates how to debug in VSCode using step throught, breakpoints, and F12,  
as well in the main program as in a local dependency which is linked in with "nmp link".  

The initial commit uses JavaScript.  
The last commit uses TypeScript for both the main app as the dependency, while the dependency is bundled with WebPack.
  
# Setup

## Environment

Tested on:
- Windows 10
- VSCode v1.63.2
- Node.js v14.16.0
- NPM 7.24.2

## Use

Clone this repository to your local disk.  It includes the main app and the dependency each in their own subdirectory.

The easiest way is to open "sourcemapstest_main3" and "sourcemapstest_dep3" each in a separate instance of VSCODE.

In the terminal of "sourcemapstest_dep3" run:
1. `npm ci`
2. `npm run build`
3. `npm link`

In the terminal of "sourcemapstest_main3" run:
1. `npm ci`
2. `npm link "sourcemapstest_dep3"`
3. `npm run build`
4. check whether the app runs with: `npm start` 
    It works fine if it outputs to the terminal without errors:
    ```
    FR: Bonjour!  --  NL: Hallo!
    FR: Bonjour!  --  NL: Hallo!
    ```
5. set breakpoints in the .ts files ***via the VSCode instance of "sourcemapstest_main3"***:
    - for the main project via the code in the ./src directory
    - for the dependency project via the code in ./node_modules/sourcemapstest_dep3/src
6. run the debugger (F5) using the configuration in launch.json.   

Warning: every subsequent `npm install ....` may destroy the symlink.  So you might have to re-setup the symlink.

# BREAKPOINTS

## Expected behaviour

If the setup is correct, you can set breakpoints in the source-code:
- for the main project via the code in the ./src directory
- for the dependency project via the code in ./node_modules/sourcemapstest_dep3/src

Start debugging via F5.  The debugger uses the parameters in the .vscode/launch.json configuration file.  All breakpoints should permanently be prededed with a full red circle.  And the debugger should halt at every breakpoint, even at the breakpoints in the dependency code.

## Diagnostics: The "Debug Doctor"

During debugging, go to the **Debug Console** and type:
```
.scripts
```
A window titled "Debug Doctor" appears with options to check the binding of your breakpoints, and to check the loading of scripts and sourcemaps.

## Diagnostics: The debug diagnostics log

By adding 
```
"trace": true
```
to your launch.json file, a debug-log file is created during each debug session.
The path of this file is visible in the debug console.

## Diagnostics: The debugger statement

Add the statement
```
debugger
```
to your source code.  When running the code in the debugger, it should halt when it reaches there.

# SYMLINK

## Create symlink on the dependency side

In the terminal in the base directory of the dependency, run:
```
npm link
```

## Create symlink on the main side

In the terminal in the base directory of the main app, run:
```
npm link "<package name of the dependency>"
// The package name is the value of the name entry in package.json.
```
Thus in this example:  
```
npm link "sourcemapstest_dep3"
```

## Required addition to Launch.json file

```
"runtimeArgs": ["--preserve-symlinks"]
```
has to be added to the configuration section in the launch.json file, if you use symlinks to connect to dependencies.  Without this addition, the debugger will not be able to bind your breakpoints correctly.

## Diagnostics

You can verify the existance of symlinks by visiting the following link in Windows Explorer: 
```
%appdata%\npm\node_modules
```

## Remove symlink on the main side

In the terminal in the base directory of the main app, run:
```
npm unlink "<package name of the dependency>"
// The package name is the value of the name entry in package.json.
```

## Remove symlink on the dependency side

In the terminal in the base directory of the dependency, run:
```
nmp unlink -g
```

# WEBPACK

## Compatibility with NPM Link

The paths to the source files, in the sourcemaps created by webpack, are not compatible with NPM Link.  
They look like `webpack://sourcemapstest_dep3/./src/greetingdutch.ts`  
while the use of NPM Link requires paths relative to the location of the sourcemap, e.g.: `../src/greetingdutch.ts`

This can be solved by adding the `devtoolModuleFilenameTemplate` parameter to the output section of the webpack.config.js file:
```
output: {
    libraryTarget: "commonjs",
    path: path.resolve(__dirname, "./dist"),
    filename: "bundle.js",        
    devtoolModuleFilenameTemplate: function (info) {
        return path.relative(path.resolve(__dirname, './dist'), info.absoluteResourcePath);
    },
},
```

## Diagnostics

The anonymous function in the webpack.config.js file can easily be debugged with the VSCode-debugger, just as any other javascript file.  
Adding the following launch.json file to the dependency project, allows to step through it with the debugger and set breakpoints:

```
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Launch Webpack",
            "program": "${workspaceFolder}/node_modules/webpack/bin/webpack.js"
        }
    ]
}
```

# IMPORTANT SETTINGS

## tsconfig.json (main & dependency)

```     
"sourceMap": true,      // create sourcemaps
"declaration": true,    // create type-files
"outDir": "./dist"      // output directory for tsc compiler (ADAPT)
```

## package.json (dependency only)

``` 
"name": "jinaga",                  // the package name used in the NPM Link command
"main": "dist/index.js",           // location of the JavaScript bundle (ADAPT)
"types": "dist/types/index.d.ts",  // location of the main type file (ADAPT)
``` 

## webpack.config.js (dependency only)

``` 
// include sourcemaps with the bundle file.
devtool: 'source-map',

// Here we generate the paths to be used in the .map files generated by  
// WebPack, to point back to the TypeScript source files. Without this,  
// WebPack will generate paths of the form 
// `webpack://sourcemapstest_dep3/./src/greetingdutch.ts`,
// which VSCode does not seem to understand. (ADAPT)
output: {
    devtoolModuleFilenameTemplate: function (info) {
        return path.relative(path.resolve(__dirname, './dist'), info.absoluteResourcePath);
    },
}
``` 

## Launch.json (main only)

```
"configurations": [
    {
        // Required when debugging with symlinks
        "runtimeArgs": ["--preserve-symlinks", "--nolazy"],  
        
        // The locations were VSCode can find the "executables" to be
        // used in the breakpoint-mapping process.  Without these locations,
        // the program will still run, but VSCode will miss the breakpoints.
        // Making the location very general will increase startup time for the debugger.
        // For testing, start with "${workspaceFolder}/**/*.js", but once working,
        // narrow down to increase startup time.  (ADAPT)
        "outFiles": [
            "${workspaceFolder}/dist/**/*.js",
            "${workspaceFolder}/node_modules/jinaga/**/*.js"
        ]             
    }
]
``` 

---
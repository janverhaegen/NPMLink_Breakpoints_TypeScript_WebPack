# Purpose

The project in this repository demonstrates how to debug in VSCode, with breakpoints as well in the main program as in a local dependency linked in with "nmp link".  
The initial commit uses JavaScript.  The last commit uses TypeScript.
  
# Setup

## Environment

Tested on:
- Windows 10
- VSCode v1.63.2
- Node.js v14.16.0
- NPM 7.24.2

## Use

Open "sourcemapstest_main3" and "sourcemapstest_dep3" each in a separate instance of VSCODE.

In the terminal of "sourcemapstest_dep3" run:
1. `npm ci`
2. `npm run build`
3. `npm link`

In the terminal of "sourcemapstest_main3" run:
1. `npm ci`
2. `npm link "sourcemapstest_dep3"`
3. `npm run build`
4. check whether the app runs with: `npm start  ` 
    It works fine if it outputs to the terminal without errors:
    ```
    FR: Bonjour!  --  NL: Hallo!
    FR: Bonjour!  --  NL: Hallo!
    ```
5. set breakpoints in the .ts files ***via the VSCode instance of "sourcemapstest_main3"***:
    - for the main project via the code in the ./src directory
    - for the dependency project via the code in ./node_modules/sourcemapstest_dep3/src
6. run the debugger (F5) using launch.json.   

Warning: every subsequent `npm install ....` may destroy the symlink.  So you might have to redo the symlink.

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

In the terminal in the base directory of the main app run:
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
C:\Users\Jan\AppData\Roaming\npm\node_modules
```

## Remove symlink on the main side

In the terminal in the base directory of the main app run:
```
npm unlink "package name of the dependency>"
// The package name is the value of the name entry in package.json.
```

## Remove symlink on the dependency side

In the terminal in the base directory of the dependency, run:
```
nmp unlink -g
```

---
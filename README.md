# electron-typescript



## IntelliJ run configurations

### Run/debug
- Type: Node.js
- Node interpreter: `node_modules\electron-prebuilt\dist\electron.exe`
- Working directory: `target\compiler-js\src`
- JavaScript file: `index.js`
- Application parameters: `.`
- Before launch: Compile TypeScript

### Tests
- Type: Mocha
- Working directory: `target\compiler-js`
- Extra Mocha options: `--require test\testSetup`
- Test directory: `target\compiler-js\test` (include subdirectories)
- Before launch: Compile TypeScript

# GlitterTS 
- ## A hybrid framework for web/ios/android

### Step1.
#### Create an empty Glitter project：
-`node create.js`

### Step2.
#### Auto build your Glitter project：
-`
tsc --project tsconfig.json && tscpaths -p tsconfig.json -s ./src -o ./src && tsc -w`

### Other.
#### Build your project to other dir and ignore ts file ：
-`node release.js path=dir`
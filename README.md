# GlitterTS 
- ## A hybrid framework for web/ios/android
- 
### Step1.
### Add glitter plugin by npm
-`npm install @jianzhi.wang/glitter`
### Step2.
#### Create an empty Glitter project：
-`node create.js`

### Step3.
#### Auto build your Glitter project：
-`
tsc --project tsconfig.json && tscpaths -p tsconfig.json -s ./src -o ./src && tsc -w`

### Optional.
#### Build your project to other dir and ignore ts file ：
-`node release.js path=dir`
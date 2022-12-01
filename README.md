# GlitterTS 
### A hybrid framework for web/ios/android

-------
### Step1.
### Add glitter plugin by npm
-`npm install @jianzhi.wang/glitter`
### Step2. 
#### Create an empty Glitter project：
-`
"create": "node create.js",`

### Step3.
#### Auto build your Glitter project：
-`
"start:tscAuto": "tsc --project tsconfig.json && tscpaths -p tsconfig.json -s ./src -o ./src && tsc -w"`

### Optional.
#### Build your project to other dir and ignore ts file ：
-`"release": "node release.js  path=test"`

-------
### Sample
`
"scripts": {
"create": "node create.js",
"start:tscAuto": "tsc --project tsconfig.json && tscpaths -p tsconfig.json -s ./src -o ./src && tsc -w",
"release": "node release.js  path=test"
}
`
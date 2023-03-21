# GlitterTS

### Glitter is a cross-platform hybrid framework that can develop Android,IOS and Web applications at the same time

-------

### Step1.

### Add glitter plugin by npm

-`npm install ts-glitter`

### Step2.

#### Create an empty Glitter project：

-`node create.js`

### Step3.

#### Auto build your Glitter project：

-```tsc --project tsconfig.json  && tsc -w```

-------
### Dependency

#### - Set up your dependencies in glitterDeps.json
``` {
  "dependencies": [
    {
      "name": "test.js",
      "path": "https://raw.githubusercontent.com/sam38124/GlitterForIOS/master/Package.resolved"
    }
  ]
}  
```
#### - Download your dependencies to glitterLib dir
```node install.js```

-------
### Release project.

#### - Build your project to other dir and ignore ts file ：

`node release.js  path=test`


-------

### Sample

```
"scripts": {

"create": "node node_modules/ts-glitter/create.js",  

"start:tscAuto": "tsc --project tsconfig.json  && tsc -w",

"release": "tsc --project tsconfig.json  && node node_modules/ts-glitter/release.js  path=test",

"install": "node node_modules/ts-glitter/install.js"

}
```

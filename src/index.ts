var debug = require('debug')('tda');

let pkg = require('../package.json');

import * as fs from "fs";

import pathModule = require('path');
import Promise = require('bluebird')

import yargs  = require('yargs')

import htmlTemplate from './templates/html'

var argv = process.argv;

let args: any = yargs
    .usage(pkg.description + "\n\n$0")
    .version(pkg.version, 'version')
    .describe('d', 'Feature directory')
    .demand('d')
    .alias('d', 'directory')
    // .describe('f', 'Feature file')
    // .demand('f')
    // .alias('f', 'feature')
    .describe('o', 'Output File')
    .demand('o')
    .alias('o', 'output')
    .parse(argv);

function generate(basepath: string, context: any) : any {
    var promises : any = []
    Object.keys(templates).forEach(function (key) {
        promises.push(templates[key](basepath,context));
    });
    return Promise.all(promises);
}

function processFile(featureFile:string){
  debug(featureFile);
  let featureFileContent : string = fs.readFileSync(featureFile,"UTF-8");
  generate(".",{feature: featureFileContent}).then(function(res: any){
    let feature : any = pathModule.parse(featureFile);
    console.log("Generated:"+ feature.name);
    let p = pathModule.join(output,feature.name+".html");
    fs.writeFileSync(p,res);
  })
}

let output: string  = <string> args['o'];

let templates : any = {
    'index.html': htmlTemplate
}

let featureFile: string  = <string> args['f'];
let featureDirectory: string  = <string> args['d'];

if(featureFile!=null && !pathModule.isAbsolute(featureFile)){
  featureFile = pathModule.join(process.cwd(),featureFile);
  processFile(featureFile)
}

if(featureDirectory!=null){
  fs.readdir(featureDirectory,function(err,files){
    for(var each in files){
      processFile(pathModule.join(featureDirectory,files[each]));
    }
  })
}

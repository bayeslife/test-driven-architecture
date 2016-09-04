var debug = require('debug')('example');

let pkg = require('../package.json');

import * as fs from "fs";

import pathModule = require('path');
import Promise = require('bluebird')

import yargs  = require('yargs')

import htmlTemplate from './templates/html'
import denormalize from './denormalizer'

var argv = process.argv;

let args: any = yargs
    .usage(pkg.description + "\n\n$0")
    .version(pkg.version, 'version')
    .describe('s', 'Solution input file')
    .demand('s')
    .alias('s', 'solution')
    .describe('e', 'Environment input File')
    .demand('e')
    .alias('e', 'environment')
    .describe('o', 'Output File')
    .demand('o')
    .alias('o', 'output')
    .parse(argv);

let solution: string  = <string> args['s'];
let environment: string  = <string> args['e'];
let output: string  = <string> args['o'];

console.log(solution);


let solution_json : any = JSON.parse(fs.readFileSync(solution,"UTF-8"));
let environment_json : any = JSON.parse(fs.readFileSync(environment,"UTF-8"));


let templates : any = {
    'index.html': htmlTemplate
}

function generate(basepath: string, asolution: any) {
    var promises : any = []
    Object.keys(templates).forEach(function (key) {
        promises.push(templates[key](basepath,asolution));
    });
    return Promise.all(promises);
}


denormalize(solution_json,environment_json).then(function(asolution: any){
  generate(".",asolution).then(function(res: any){
    console.log("Generated");
    fs.writeFileSync(output,res);
  })
})


// for(var response in responses){
//     var body = responses[response].body;
//     for(var bodytype in body){
//         var body_of_type = body[bodytype];
//         var examples: any = body[bodytype].examples;
//         if(examples){
//             console.log('Deleting Examples');
//             delete body_of_type['examples'];
//         }
//     }
// }
//


import * as handlebars  from 'handlebars';

import * as fs from "fs";

import Promise = require('bluebird')
import path = require('path');

import * as helpers from './helpers'
let hlprs: any = helpers;

var Visitor = handlebars.Visitor;

class ImportScanner  extends Visitor {
      partials : any = [];

      PartialStatement(partial:any){
         var name = partial.name.original;

      if (!path.isAbsolute(name)) {
        name = path.join('/src/handlebars', name);
      }
      partial.name.original = name
      //console.log(name);
      this.partials.push(name);
      }
}

class Renderer {
   ctx: any;

   ids: any={};
   templates: any = {};
   baseUri: string ="http://localhost";
   partials : any = [];

   constructor(public defaultBasePath: string){

     for (var name in hlprs.helpers) {
       let helperFn = hlprs.helpers[name];
       //console.log("RegisterHelper:"+name);
        handlebars.registerHelper(name,helperFn);
      }
   }

   slug(name: string) {
      return name
          .replace(/ /g, '-')
          .replace(/[?!]/g, '')
          .replace(/_/g, '-')
          .replace(/['"]/g, '')
          .replace(/[(){}]/g, '')
          .replace(/\[/g, '')
          .replace(/\]/g, '')
          .replace(/[\/\\]/g, '-')
          .toLowerCase();
    }

   newId(name: string) {
    name = this.slug(name);
    var id = name;
    var index = 0;

    while (id in this.ids) {
      index++;
      id = name + index;
    }

    return id;
  }

   readFile(filename: string) : Promise<string> {
     return new Promise<string>(function(resolve, reject) {
       //fs.readFile(filename, { encoding: 'utf-8'}, function(err, text) {
       var rs = fs.readFileSync(filename,'utf-8');
       resolve(rs);
     });
   }

   template(name: string, context: any) {
     try {
       console.log('Running template:'+ name);
       fs.writeFileSync('/tmp/context.json',JSON.stringify(context,null,1));
      return this.templates[name](context);
     }catch(e){
       console.log(e);
     }
   }


  prepare(filename: string) : Promise<any> {
    var r = this;

    var basepath = this.defaultBasePath;

    //console.log("Prepare:"+ basepath+" filename"+ filename);

    return new Promise(function(resolve: any,reject: any){
      if (r.templates[filename]) {
          resolve();
      }else {

        r.readFile(basepath+'/'+filename)
        .then(function(content: string) {

          try {
            var ast = handlebars.parse(content);

            let scanner  = new ImportScanner();

            scanner.accept(ast);
            var promises = scanner.partials.map(function(fn:string){
              return r.prepare(fn);
            });
            r.templates[filename] = handlebars.compile(ast);
            console.log("RegisterPartial:"+ filename);
            handlebars.registerPartial(filename,r.templates[filename]);
            if(promises.length>0){
              Promise.all(promises).then(function(){
                resolve();
              })
            }else
              resolve();

          }catch(exception){
            console.log(exception)
            reject(exception);
          }
        })
        .catch(function(msg: string){
          console.log(msg);
          reject();
        });
      }
  });
}



  render(filename: string, context: any) : Promise<any>{

    var t = this;

    this.ctx = context;
    return new Promise(function(resolve: any,reject: any){
      if (!filename) {
        throw new Error("template file is not defined");
      }

      try {

                      if (t.templates[filename]!= undefined) {
                        var res = t.template(filename, t.ctx );
                        resolve(res);
                      }else {
                        t.prepare(filename)
                          .then(function() {
                            var res = t.template(filename, t.ctx);
                            resolve(res);
                          })
                          .catch(function(msg: any){
                            console.log(msg);
                          })
                      }

      }catch(exception){
        console.log(exception)
      }
    });
  }
}

export default function (basepath: string,solution: any) {
  let renderer: Renderer = new Renderer(basepath);
  return renderer.render("src/handlebars/index.hbs",solution);
}

#!/usr/bin/env node

var debug = require('debug')('denormalizer');

import Promise = require('bluebird');

import * as rx from "rxjs";


export default function denormalize(solution: any[], environments: any[],typetests: any) : Promise<any>{

  let data : SolutionData = new SolutionData();
  data.solution = solution;
  data.environments = environments;
  data.typetests = typetests;

  // data.setupHosts().then(function(res){
  //   console.log(res);
  // });

  data.updateTests().then(function(){
    //console.log(data.solution);
  });

  return Promise.resolve({ "environments": environments, "components": solution})
}


class SolutionData  {

  solution: any[];
  environments : any[];
  typetests: any;

  implementationComponents: any[];

  setupHosts() : Promise<any> {
    let t = this;
    let result : any = [];
    return new Promise(function(res,rej){
        return Promise.map(t.environments, function(environment) {
          return Promise.map(environment.zones, function(zone:any) {
            return Promise.map(zone.components, function(component:any) {
              return Promise.map(component.hosts, function(host:any) {
                return result.push({ environment: environment.name, zone: zone.name, component: component.name , host: host.name});
              })
            })
          })
        })
        .then(function () {
          res(result);
        });
      })
    }

  updateTests() : Promise<any> {
    let t = this;
    let solutionObs = rx.Observable.from(this.solution);
    return new Promise(function(res,rej){
      let implementationComponents : any[]= [];
      solutionObs
        .subscribe({
          next: function(c:any){
            t.testEnrich(c);
          },
          complete: () => res(this)
        });
    })
  }

  testEnrich(solutionComponent: any): void{
    if(this.typetests[solutionComponent.type] && this.typetests[solutionComponent.type].implementationTests){
      solutionComponent['implementationTests']=[];
      for(var each of this.typetests[solutionComponent.type].implementationTests)
        var test : any = {}
        test.name=each
        solutionComponent['implementationTests'].push(test);
        for(var env of this.environments)
          test[env.name] = env.name;
        console.log(test);
    }
    if(this.typetests[solutionComponent.type] && this.typetests[solutionComponent.type].infrastructureTests){
      solutionComponent['infrastructureTests']= [];
      for(var each of this.typetests[solutionComponent.type].implementationTests)
        var test : any = {}
        test.name=each
        solutionComponent['infrastructureTests'].push(test);
        for(var env of this.environments)
          test[env.name] = env;
    }
  }
}

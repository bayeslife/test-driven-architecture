/// <reference path="../node_modules/alasql/dist/alasql.d.ts" />

var debug = require('debug')('denormalizer');

import Promise = require('bluebird');

import * as rx from "rxjs";

var sql = require('alasql');

export default function denormalize(solution: any[], environments: any[],typetests: any) : Promise<any>{

  let data : SolutionData = new SolutionData();
  data.solution = solution;
  data.environments = environments;
  data.typetests = typetests;

  return new Promise(function(res,rej){
    data
      .setupHostTable()
      .then(function(){
        data
          .setupImplementationTestsTable()
          .then(function(){

            data.setupImplementationTable();
            return res({ "environments": environments, "components": solution, "implementationTests": data.implementation_tests_table })
          })
      });

    // data.updateTests().then(function(){
    //   //console.log(data.solution);
    // });

  })

}


class SolutionData  {

  solution: any[];
  environments : any[];
  typetests: any;

  implementationComponents: any[];

  host_table: any[] = [];
  tests_table: any[] = [];

  implementation_tests_table: any[] =[];

  setupHostTable() : Promise<any> {
    let t = this;
        return Promise.map(t.environments, function(environment) {
          return Promise.map(environment.zones, function(zone:any) {
            return Promise.map(zone.components, function(component:any) {
              return Promise.map(component.hosts, function(host:any) {
                return t.host_table.push({ environment: environment.name, zone: zone.name, component: component.name , host: host.name});
              })
            })
          })
        });
    }
    setupImplementationTestsTable() : Promise<any> {
      let t = this;
          return Promise.map(t.typetests, function(type:any) {
            return Promise.map(type.implementationTests, function(test:any) {
                  return t.tests_table.push({ type: type.name, test: test});
            })
          });
      }

  setupImplementationTable() : void {
    this.implementation_tests_table =  sql('SELECT HOSTS.host , HOSTS.environment, HOSTS.zone,HOSTS.component, COMPONENTS.name, TESTS.test FROM ? as HOSTS JOIN ? as COMPONENTS on HOSTS.component=COMPONENTS.type OUTER JOIN ? as TESTS on COMPONENTS.type=TESTS.type  ',[this.host_table, this.solution, this.tests_table]);
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

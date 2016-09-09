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
      .setupComponentTypeTable()
      .then(function(){

        data
          .setupLoadBalancerTable()
          .then(function(){

            data
              .setupComponentCommunicationTable()
              .then(function(){
                data
                  .setupHostTable()
                  .then(function(){
                    data
                      .setupImplementationTestsTable()
                      .then(function(){

                        data.setupImplementationTable();
                        data.setupConnectivityTable();
                        data.updateLoadBalancerTable();
                        data.setupFirewallTable();

                        return res({
                          hosts: data.host_table,
                          firewalltests : data.firewalltests,
                          firewall: data.firewall_table,
                          componentTypes: data.componentType_table,
                          dependencies: data.component_dependencies_table,
                          loadbalancers: data.lb_table,
                          environments: environments,
                          components: solution,
                          implementationTests: data.implementation_tests_table,
                          connectivity: data.component_connectivity_table
                        })
                      })
                  });
              })
          })

      })

  })

}


class SolutionData  {

  solution: any[];
  environments : any[];
  typetests: any;

  implementationComponents: any[];

  componentType_table: any[] = [];
  host_table: any[] = [];
  tests_table: any[] = [];

  implementation_tests_table: any[] =[];

  component_dependencies_table: any[] =[];
  component_connectivity_table: any[] =[];

  lb_table: any[] =[];

  firewalltests : string[]= [];
  firewall_table: any[] =[];

  setupComponentTypeTable() : Promise<any> {
    let t = this;
        return Promise.map(t.environments, function(environment) {
          return Promise.map(environment.zones, function(zone:any) {
            return Promise.map(zone.components, function(component:any) {
                return t.componentType_table.push({ environment: environment.name, zone: zone.name, component: component.name , hosts: component.hosts});
            })
          })
        });
    }

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
          return t.tests_table.push({ componentType: type.componentType, tests: type.implementationTests});
        });
    }

  setupImplementationTable() : void {
    this.implementation_tests_table =  sql('SELECT HOSTS.host , HOSTS.environment, HOSTS.zone,HOSTS.component, COMPONENTS.name, TESTS.tests FROM ? as HOSTS JOIN ? as COMPONENTS on HOSTS.component=COMPONENTS.type JOIN ? as TESTS on COMPONENTS.type=TESTS.componentType  ',[this.host_table, this.solution, this.tests_table]);
    //console.log(this.implementation_tests_table);
  }

  setupComponentCommunicationTable() : Promise<any> {
    let t = this;
    return Promise.map(t.solution, function(component:any) {
      if(component.dependencies){
        return Promise.map(component.dependencies, function(dep:any) {
          return t.component_dependencies_table.push({ source: component.name, type: component.type, targetComponent: dep});
        })
      }else {
         return;
      }
    });
  }

  setupConnectivityTable() : void {

    //
    // let j1 = sql('SELECT DEPENDENCY.source AS sComponent,DEPENDENCY.type AS sType,DEPENDENCY2.source AS tComponent,DEPENDENCY2.type AS tType  FROM ? as DEPENDENCY join ? as DEPENDENCY2 on DEPENDENCY.targetComponent = DEPENDENCY2.source',[this.component_dependencies_table,this.component_dependencies_table,this.componentType_table,this.componentType_table]);
    // //console.log(j1);
    //
    // let j2 = sql('select D.sComponent,D.sType,C.zone AS sZone,C.environment as sEnvironment,C.hosts AS sHosts,D.tComponent  ,D.tType FROM ? as D LEFT JOIN ? as C on C.component=D.sType',[j1,this.componentType_table]);
    // console.log(j2);
    // //console.log(this.componentType_table);
    //
    // let j3 = sql('select D.sComponent,D.sType,C.zone AS sZone,C.environment as sEnvironment,C.hosts AS sHosts,D.tComponent  ,D.tType FROM ? as D LEFT JOIN ? as C on C.component=D.sType',[j1,this.componentType_table]);
    // console.log(j2);

    this.component_connectivity_table =
    sql('SELECT DEPENDENCY.source AS sComponent, DEPENDENCY.type as sType, COMP1.zone AS sZone, COMP1.environment AS sEnvironment, COMP1.hosts as sHosts, DEPENDENCY.targetComponent AS tComponent, DEPENDENCY2.type AS tType, COMP2.zone AS tZone, COMP2.environment AS tEnvironment, COMP2.hosts as tHosts   FROM ? as DEPENDENCY join ? as DEPENDENCY2 on DEPENDENCY.targetComponent = DEPENDENCY2.source JOIN ? as COMP1 on COMP1.component=DEPENDENCY.type JOIN ? as COMP2 on COMP2.component=DEPENDENCY2.type and COMP1.environment=COMP2.environment',[this.component_dependencies_table,this.component_dependencies_table,this.componentType_table,this.componentType_table]);
    //console.log(this.component_connectivity_table);
  }

  setupLoadBalancerTable() : Promise<any> {
    let t = this;
    return Promise.map(t.environments, function(environment) {
      return Promise.map(environment.zones, function(zone:any) {
        return Promise.map(zone.components, function(component:any) {
          if(component.hosts && component.hosts.length>1){
              return t.lb_table.push({ environment: environment.name, zone: zone.name, component: component.name , hosts: component.hosts});
          }else{
            return;
          }
        })
      })
    });

  }

  updateLoadBalancerTable() : void {
    this.lb_table = sql('SELECT "lb_"+COMPONENT.name+"_"+LB.environment AS name , LB.component,LB.zone, LB.environment, LB.hosts, COMPONENT.name AS component  FROM ? as LB join ? as COMPONENT on LB.component = COMPONENT.type ',[this.lb_table,this.solution]);
    //console.log(this.lb_table);
  }


  setupFirewallTable() : void {

    let j1 = sql('SELECT DEPENDENCY.source AS sComponent, DEPENDENCY.type as sType, DEPENDENCY2.source AS tComponent, DEPENDENCY2.type AS tType FROM ? as DEPENDENCY join ? as DEPENDENCY2 on DEPENDENCY.targetComponent = DEPENDENCY2.source',[this.component_dependencies_table,this.component_dependencies_table]);
    //console.log(j1);

    let j2 = sql('SELECT D.sComponent, D.sType, H.zone as sZone, H.environment as sEnvironment, H.host as sHost, D.tComponent, D.tType FROM ? as D join ? H on H.component=D.sType',[j1,this.host_table]);
    //console.log(j2);

    let j3 = sql('SELECT D.sComponent, D.sType, D.sZone, D.sEnvironment, D.sHost, D.tComponent, D.tType, H.zone as tZone, H.environment as tEnvironment, H.host as tHost FROM ? as D join ? H on H.component = D.tType',[j2,this.host_table]);
    //console.log(j3);

    let j4 = sql('SELECT "FW:"+C.sHost+"_"+C.sZone+":"+C.tComponent+"_"+C.tZone AS rule,* from ? AS C where C.sZone != C.tZone',[j3]);
    //console.log(j4);

    this.firewall_table = j4;

    this.firewalltests = sql('SELECT * from ? where componentType="FW"',[ this.typetests])[0].infrastructureTests;

    for(var fw of this.firewall_table){
      fw.tests = this.firewalltests;
    }
    //console.log(this.firewall_table);
  }
}

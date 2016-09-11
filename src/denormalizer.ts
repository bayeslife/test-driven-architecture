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

    data.setupContentSwitchHosts()
      .then(data.setupServiceTable)
      .then(data.setupComponentTypeTable)
      .then(data.setupComponentCommunicationTable)
      .then(data.setupHostTable)
      .then(data.setupImplementationTestsTable)
      .then(data.setupComponentServicesTable)
      .then(data.updateServiceTable)
      .then(data.setupLoadBalancerTable)
      .then(data.setupImplementationTable)
      .then(data.setupConnectivityTable)
      .then(data.setupFirewallTable)
      .then(function(){
        res({
          hosts: data.host_table,
          firewalltests : data.firewalltests,
          firewall: data.firewall_table,
          componentTypes: data.componentType_table,
          dependencies: data.component_dependencies_table,
          loadbalancers: data.lb_table,
          environments: environments,
          components: solution,
          implementationTests: data.implementation_tests_table,
          connectivity: data.component_connectivity_table,
          serviceTypes: data.component_service_table,
          services: data.service_table
        })
      })
    })
}

class SolutionData  {

  solution: any[];
  environments : any[];
  typetests: any;

  service_table: any[];

  implementationComponents: any[];

  componentType_table: any[] = [];
  component_service_table: any[] = [];
  host_table: any[] = [];
  tests_table: any[] = [];

  implementation_tests_table: any[] =[];

  component_dependencies_table: any[] =[];
  component_connectivity_table: any[] =[];

  lb_table: any[] =[];

  firewalltests : string[]= [];
  firewall_table: any[] =[];

  setupContentSwitchHosts = () => {
    debug("setupContentSwitchHosts")
    let t = this;
        return Promise.map(t.environments, function(environment) {
          return Promise.map(environment.zones, function(zone:any) {
            return Promise.map(zone.components, function(component:any) {
              if(component.type=='ContentSwitch'){
                component.hosts = [ { "name": zone.host } ];
                return Promise.resolve(null);
              }
            })
          })
        });
    }
    setupServiceTable = () => {
      debug("setupServiceTable")
        //console.log("Setup Service Table");
        let j1 = sql('SELECT S.name AS service,S.type AS serviceType  FROM ? as S ',[this.solution]);
        this.service_table = j1;
        return Promise.resolve(true);

    }

    setupComponentTypeTable = () =>  {
      debug("setupComponentTypeTable")
      //console.log("setupComponentTypeTable");
      let t = this;
          return Promise.map(t.environments, function(environment) {
            return Promise.map(environment.zones, function(zone:any) {
              return Promise.map(zone.components, function(component:any) {
                  return t.componentType_table.push({ environment: environment.name, zone: zone.name, component: component.type , hosts: component.hosts});
              })
            })
          });
      }

      setupComponentCommunicationTable = () => {
        debug("setupComponentCommunicationTable")
        let t = this;
        return Promise.map(t.solution, function(component:any) {
          if(component.dependencies){
            debug("dependencies")
            return Promise.map(component.dependencies, function(dep:any) {
              return t.component_dependencies_table.push({ source: component.name, type: component.type, targetComponent: dep});
            })
          }else {
             return;
          }
        });
      }


      setupComponentServicesTable = () => {
        debug("setupComponentServicesTable")
        let t = this;
            return Promise.map(t.environments, function(environment) {
              return Promise.map(environment.zones, function(zone:any) {
                return Promise.map(zone.components, function(component:any) {
                  if(component.services)
                    return Promise.map(component.services, function(service:any) {
                      return t.component_service_table.push({ environment: environment.name, zone: zone.name, infrastructure: component.name, infrastructureType: component.type , serviceType : service, hosts: component.hosts});
                    })
                })
              })
            });
        }



  setupHostTable = () => {
    debug("setupHostTable")
    let t = this;
        return Promise.map(t.environments, function(environment) {
          return Promise.map(environment.zones, function(zone:any) {
            return Promise.map(zone.components, function(component:any) {
              if(component.type=='Compute'){
                return Promise.map(component.hosts, function(host:any) {
                  return t.host_table.push({ environment: environment.name, zone: zone.name, infrastructure: component.name, infrastructureType: component.type , host: host.name});
                })
              }else
                return Promise.resolve(null);

            })
          })
        });
    }

  setupImplementationTestsTable = () => {
    debug("setupImplementationTestsTable")
    let t = this;
      return Promise.map(t.typetests, function(type:any) {
        return t.tests_table.push({ componentType: type.componentType, tests: type.implementationTests});
      });
    }

  setupImplementationTable = () =>{
    debug("setupImplementationTable")
    this.implementation_tests_table =  sql('SELECT * FROM ? as S JOIN ? as T on S.serviceType=T.componentType  ',[this.service_table, this.tests_table]);
    //console.log(this.implementation_tests_table);
    return Promise.resolve(null);
  }




  updateServiceTable = () =>{
    debug("updateServiceTable")
    let j2 = sql('select * FROM ? as D LEFT JOIN ? as C on C.serviceType=D.serviceType',[this.service_table,this.component_service_table]);
    this.service_table = j2;
    return Promise.resolve(null);
  }

  setupConnectivityTable = () =>{
    debug("setupConnectivityTable")
    let j1 = sql('SELECT DEPENDENCY.source AS sComponent,DEPENDENCY.type AS sType, DEPENDENCY.targetComponent AS tComponent,DEPENDENCY2.type AS tType  FROM ? as DEPENDENCY join ? as DEPENDENCY2 on DEPENDENCY.targetComponent = DEPENDENCY2.source',[this.component_dependencies_table,this.component_dependencies_table]);

    let t = sql("SELECT * from ? as D where D.tComponent = 'pay.ami.co.nz'",[j1]);
    //console.log(this.component_dependencies_table);

    //console.log(this.component_service_table[0]);

    let j2 = sql('select D.sComponent,D.sType,C.zone AS sZone,C.environment as sEnvironment,C.infrastructure AS sInfrastructure,C.infrastructureType as sInfrastructureType,C.hosts AS sHosts,D.tComponent,D.tType FROM ? as D LEFT JOIN ? as C on C.serviceType=D.sType',[j1,this.component_service_table]);

    //console.log(j2[0]);

    let j3 = sql('select D.sComponent,D.sType,D.sEnvironment,D.sZone,D.sInfrastructure,D.sInfrastructureType,D.sHosts,D.tComponent ,D.tType,C.zone AS tZone,C.environment as tEnvironment,C.infrastructure AS tInfrastructure,C.infrastructureType as tInfrastructureType,C.hosts AS tHosts FROM ? as D LEFT JOIN ? as C on C.serviceType=D.tType',[j2,this.component_service_table]);

    //console.log(j3[0]);

    this.component_connectivity_table = j3;
    return Promise.resolve(null);

  }


  setupLoadBalancerTable = () => {
    debug("setupLoadBalancerTable")
    let j1 = sql('SELECT D.service,D.serviceType AS type  FROM ? as D',[this.service_table]);
    //console.log(j1)

    let j2 = sql('SELECT  D.service,D.type,I.infrastructure,I.infrastructureType,I.environment,I.zone,I.hosts FROM ? as D join ? as I on D.type=I.serviceType',[j1,this.component_service_table]);
    //console.log(this.component_service_table);
    //console.log(j2)

    let j3 = sql('SELECT  * FROM ? as D where D.infrastructureType="Compute"',[j2]);

    let j4 = sql('SELECT  "LB_"+D.zone+"_"+D.service as name ,* FROM ? as D where D.infrastructureType="Compute"',[j2]);

    //console.log(j4);
    //this.lb_table = sql('SELECT "lb_"+LB.environment AS name , LB.component,LB.zone, LB.environment, LB.hosts  FROM ? as LB where infrastructureType="Compute" ',[this.lb_table]);
    this.lb_table=j4;
    return Promise.resolve(null);
  }



  setupFirewallTable = () => {
    debug("setupFirewallTable")
    let j4 = sql('SELECT * from ? AS C where C.sZone != C.tZone',[this.component_connectivity_table]);
    //console.log(j4);

    this.firewall_table = j4;

    this.firewalltests = sql('SELECT * from ? where componentType="FW"',[ this.typetests])[0].infrastructureTests;

    for(var fw of this.firewall_table){
      fw.tests = this.firewalltests;
    }
    //console.log(this.firewall_table);
    return Promise.resolve(null);
  }
}

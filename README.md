# Test Driven Architecture

## Problem statemnet

When specifying an architecture for a solution this could ideally be done by creating tests that fail
unless the provisioning activity results in capability which allows the tests to pass.

## Solution Overview

A page containing a table with badges that call out to invoke tests relevent to infrastructure specific to a solution.

## Representation

The solution is to be represented as:

1. an architecture : in terms of environments, connected zones,  virtual and physical interface components, and compute hosts.  
2. a solution which identifies all the application components and their connectivitiy  
3. tests for each of the architecture/application component types  

## Desired output

The desired output is a set of tables with tests for each of the entities to be provisioned.

### Implementation Service
| Service   | Component | Test         | Production | PreProduction | ... |
| ----      | ---       | ---          | ----       | ---           | --- |
| Naming    | API1      | Host Lookup  | TestBadge  | TestBadge     | ... |
| Host      | API1      | Connect Host | TestBadge  | TestBadge     | ... |
| Firewall  | API1      | Source-Dest  | TestBadge  | TestBadge     | ... |
| Service   | API1      | API Call     | TestBadge  | TestBadge     | ... |


### Infrastructure Service
| Service   | Component | Test         | Production | PreProduction | ... |
| ----      | ---       | ---          | ----       | ---           | --- |
| Naming    | Vir API1  | Host Lookup  | TestBadge      | TestBadge           | ... |
| Firewall  | Vir API1  | Source-Dest  | TestBadge      | TestBadge           | ... |
| Service   | Vir API1  | API Call     | TestBadge      | TestBadge           | ... |
| Load Bal  | Vir API1  | Load Bal     | TestBadge      | TestBadge           | ... |
| Rate Lim  | Vir API1  | Rate Lim     | TestBadge      | TestBadge           | ... |

### Dependencies Service
| Service   | Component | Test         | Production | PreProduction | ... |
| ----      | ---       | ---          | ----       | ---           | --- |
| Permission| API1      | Query        | TestBadge  | TestBadge     | ... |

## Model
### Infrastructure Model

1. Environments - Contain Zones  
1. Zones - Contain Components  
1. Components  
 - Compute
    - depends - components that run/execute on the resource  
    - services - each service component is load balanced across the compute hosts
 - ContentSwitch  
    - services - what are provided through the switch

### Component Model
IntegrationComponent
-  DotNetAPI or WebAPI  

ApplicationComponent
- any number of  APIs
 - SiteContent
 - Site

### Test Badges To Be Created

#### Connection

```
Given a client on the <zone>
When an ssl connection is requested on a <application component port>
and the client trusts the certificate authority
Then the SSL connection is established
```

#### Component

```
Given a client on <zone>
When an <application component https url> is established
and that request is the happy path request
Then the component responds with a 200 status code
```

### Infrastructure Implementation

#### DNS
```
Given a client on the <zone>
and using the default name resolution,
When the <host> is queried,
Then the <hostip> is returned.
```

```
Given a client on the <zone>
and using the default name resolution,
When the <hostip> is queried,
Then the <host> is returned.
```

#### Firewall
```
Given a client on source <zone>
When a tcpip connection is requested on a target zone and application component port
Then the tcp ip connection is not terminated
```

#### Connection
```
Given a client on a <source zone>
When an ssl connection is requested on a specific <target content switch>
and the client trusts the certificate authority
Then the SSL connection is established
```


#### Load Balancing

```
Given a client on a <source zone>
When a request is submitted to the <target content switch>
and a single implemention is running
Then response is success
```

#### Rate Limiting

```
Given a client on a <source zone>
When a multiple requests are submitted to the <target content switch>
and the rate is below the <target rate>
Then all responses are success
```

```
Given a client on a <source zone>
When a multiple requests are submitted to the <target content switch>
and the rate is above the <target rate>
Then some responses are 429 status code
```

## Sample
- See the sample solution json at data/components.json
- See the sample architecture at data/architecture-dev.json and architecture-prod.json
- See the sample tests at data/typetests.json

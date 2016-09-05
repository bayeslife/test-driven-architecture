# Test Driven Architecture

## Problem statemnet

When specifying an architecture for a solution this could ideally be done by creating tests that fail
unless the provisioning activity results in capability which allows the tests to pass.

## Solution Overview

A page containing a table with badges that call out to invoke tests relevent to infrastructure specific to a solution.

## Representation

The solution is to be represented as
- an architecture in terms of conected zones and virtual and physical interfaces and hosts within the zones.
- a solution which identifies all the components and their connectivitiy
- tests for each of the component types

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


## Candidate tests

### Implementations Prequisites

#### DNS
```
Given a client on the <implementation.network>
and using the default name resolution,
When the <implementation.hostname> is queried,
Then the <implementation.hostip> is returned.
```

```
Given a client on the <implementation network>
and using the default name resolution,
When the <implementation host ip> is queried,
Then the <implementation host name> is returned.
```

#### Connection

```
Given a client on the <implementation network>
When an ssl connection is requested on a <implementation port>
and the client trusts the certificate authority
Then the SSL connection is established
```

#### Component

```
Given a client on <implementation network>
When an <implementation https url> is established
and that request is the happy path request
Then the component responds with a 200 status code
```

### Infrastructure Implementation

#### DNS
```
Given a client on a network
and using the default name resolution,
When the hostname of the VIP is queried,
Then the host ip is returned.
```

```
Given a client on a network
and using the default name resolution,
When the hostip of the VIP is queried,
Then the host name is returned.
```

#### Firewall
```
Given a client on separate network
When a tcpip connection is requested on a specific port
Then the tcp ip connection is not terminated
```

#### Connection
```
Given a client on a <expected source network>
When an ssl connection is requested on a specific port
and the client trusts the certificate authority
Then the SSL connection is established
```


#### Load Balancing

```
Given a client on a <expected source network>
When a request is submitted to the <virtual api>
and a single implemention is running
Then response is success
```

#### Rate Limiting

```
Given a client on a <expected source network>
When a multiple requests are submitted to the <virtual api>
and the rate is below the <target rate>
Then all responses are success
```

```
Given a client on a <expected source network>
When a multiple requests are submitted to the <virtual api>
and the rate is above the <target rate>
Then some responses are 429 status code
```

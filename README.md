# Test Driven Architecture

## Problem statemnet

When specifying an architecture for a solution this could ideally be done by creating tests that fail
unless the provisioning activity results in capability which allows the tests to pass.


## Candidate tests

The following tests are organized in an order that allows tests to be simplified.

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

### Connection
```
Given a client on a <expected source network>
When an ssl connection is requested on a specific port
and the client trusts the certificate authority
Then the SSL connection is established
```


### Load Balancing

- Can a connection to the load balancer be established
- Does the
- Does a request

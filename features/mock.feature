Feature: Online Payments
In order to install Online Payments
As an architect
I want to validate the provisioned test network implementation from the ldstatdv network

Scenario Outline: Validate routing to static site
Given The environment is <environment>
When an index.html request is sent to <domain>
Then the result should be <result>

Examples:
| environment | domain             | result |
| MOCK| http://localhost:1080      | 200 |


Scenario Outline: Validate Routing of DPS Failsafe
Given The environment is <env>
When a failsafe notification request is sent to <domain> with <dps>
Then the result should be <result>

Examples:
| env | domain                    | dps |result |
| MOCK | http://localhost:1080    | R123 | 200 |

Scenario Outline: Validate Routing of anonymous-access-token
Given The environment is <environment>
When a anonymous-access-token request is sent to <domain>
Then the result should be <result>

Examples:
| environment   | domain                | result |
| MOCK          | http://localhost:1080 | 200 |

Scenario Outline: Validate customer-amount-owed-description
Given The environment is <environment>
When a anonymous-access-token request is sent to <domain>
When a customer-amount-owed-description request is sent to <domain> with <policynumber>
Then the result should be <result>

Examples:
| environment | domain                | policynumber| result |
| MOCK        | http://localhost:1080 | M123        | 200 |

Scenario Outline: Validate payment-attempts
Given The environment is <environment>
When a anonymous-access-token request is sent to <domain>
When a payment-attempt request is sent to <domain> with <policynumber>
Then the result should be <result>

Examples:
| environment | domain                    | policynumber  | result |
| MOCK        | http://localhost:1080     | M123 | 200 |

Scenario Outline: Validate payment-result
Given The environment is <environment>
When a anonymous-access-token request is sent to <domain>
When a payment-result request is sent to <domain> with <dps>
Then the result should be <result>

Examples:
| environment | domain                   | dps  | result |
| MOCK        | https://localhost:1080   | R123 | 200 |

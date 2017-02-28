Feature: Online Payments
In order to provision Online Payments
As an architect
I want to validate the provisioned netscaler/ssl and firewall implementation from the ldstatdv network

Scenario Outline: Validate routing to static site
Given The environment is <environment>
When an index.html request is sent to <domain>
Then the result should be <result>

Examples:
| environment | domain                            | result |
| DEV_EXTERNAL| https://pay.dev.ami.co.nz         | 200 |
| DEV_EXTERNAL| https://pay.dit.ami.co.nz         | 200 |

Scenario Outline: Validate Routing of DPS Failsafe
Given The environment is <env>
When a failsafe notification request is sent to <domain> with <dps>
Then the result should be <result>

Examples:
| env | domain                    | dps |result |
| DEV | https://api.dev.iag.co.nz | R123 | 200 |
| DIT | https://api.dit.iag.co.nz | R123 | 200 |


Scenario Outline: Validate Routing of anonymous-access-token
Given The environment is <environment>
When a anonymous-access-token request is sent to <domain>
Then the result should be <result>

Examples:
| environment   | domain | result |
| DEV           | https://api.dev.iag.co.nz | 200 |
| DEV_INTERNAL  | https://api.test.ldstatdv.net | 200 |
| DIT           | https://api.dit.iag.co.nz | 200 |
| DIT_INTERNAL  | https://api.dit.ldstatdv.net | 200 |

Scenario Outline: Validate customer-amount-owed-description
Given The environment is <environment>
When a anonymous-access-token request is sent to <domain>
When a customer-amount-owed-description request is sent to <domain> with <policynumber>
Then the result should be <result>

Examples:
| environment | domain | policynumber                 | result |
| DEV_INTERNAL| https://api.dev.ldstatdv.net          | M123 | 200 |
| DEV         | https://api.dev.iag.co.nz             | M123 | 200 |
| DIT_INTERNAL| https://api.dit.ldstatdv.net          | M123 | 200 |
| DIT         | https://api.dit.iag.co.nz             | M123 | 200 |

Scenario Outline: Validate payment-attempts
Given The environment is <environment>
When a anonymous-access-token request is sent to <domain>
When a payment-attempt request is sent to <domain> with <policynumber>
Then the result should be <result>

Examples:
| environment | domain                                | policynumber  | result |
| DEV_INTERNAL| https://api.dev.ldstatdv.net          | M123 | 200 |
| DEV         | https://api.dev.iag.co.nz             | M123 | 200 |
| DIT_INTERNAL| https://api.dit.ldstatdv.net          | M123 | 200 |
| DIT         | https://api.dit.iag.co.nz             | M123 | 200 |

Scenario Outline: Validate payment-result
Given The environment is <environment>
When a anonymous-access-token request is sent to <domain>
When a payment-result request is sent to <domain> with <dps>
Then the result should be <result>

Examples:
| environment | domain                                | dps  | result |
| DEV_INTERNAL| https://api.dev.ldstatdv.net          | R123 | 200 |
| DEV         | https://api.dev.iag.co.nz             | R123 | 200 |
| DIT_INTERNAL| https://api.dit.ldstatdv.net          | R123 | 200 |
| DIT         | https://api.dit.iag.co.nz             | R123 | 200 |

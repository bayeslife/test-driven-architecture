Feature: Online Payments
In order to provision Online Payments
As an architect
I want to validate the provisioned netscaler/ssl and firewall implementation from the ldstatdv network


Scenario Outline: Validate customer-amount-owed-description
Given The environment is <environment>
When a anonymous-access-token request is sent to <domain>
When a customer-amount-owed-description request is sent to <domain2> with <policynumber>
Then the result should be <result>

Examples:
| environment | domain                    | domain2                                 | policynumber | result |
| DEV         | https://api.dev.iag.co.nz | http://w12dvdidesb01:7024 | M123         | 200 |

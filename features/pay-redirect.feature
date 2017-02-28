Feature: Online Payments
In order to provision Online Payments
As an architect
I want to validate the provisioned test network implementation from the internet network

Scenario Outline: Validate interim routing to static site
Given The environment is <environment>
When an index.html request is sent to <domain>
Then the result should be <result>

Examples:
| environment | domain | result |
| DEV         | https://pay.ami.co.nz | 302 |

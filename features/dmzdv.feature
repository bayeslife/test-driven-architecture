Feature: Online Payments
In order to install AMI Online Payments
As an architect
I want to validate the provisioned network when used in the DMZDV domain

Scenario Outline: Validate Routing of pay.test.ami.co.nz
Given The environment is <environment>
When an index.html request is sent to <domain>
Then the result should be <result>

Examples:
| environment | domain | result |
| W12DZHIIS020 | https://W12DZHIIS020.lddmzdv.net:4443 | 200 |
| W12DZHIIS021 | https://W12DZHIIS020.lddmzdv.net:4443 | 200 |
| DEV | https://pay.dev.ami.co.nz | 200 |

Scenario Outline: Validate Routing of anonymous-access-token
Given The environment is <environment>
When a anonymous-access-token request is sent to <domain>
Then the result should be <result>

Examples:
| environment | domain | result |
| W12DZHIIS020 | https://W12DZHIIS020.lddmzdv.net:7029 | 200 |
| W12DZHIIS021 | https://W12DZHIIS020.lddmzdv.net:7029 | 200 |
| DEV | https://api.dev.iag.co.nz | 200 |


Scenario Outline: Validate Routing of DPS Failsafe
Given The environment is <environment>
When a failsafe notification request is sent to <domain>
Then the result should be <result>

Examples:
| environment | domain | result |
| W12DZHIIS020 | https://W12DZHIIS020.lddmzdv.net:7027 | 200 |
| W12DZHIIS021 | https://W12DZHIIS020.lddmzdv.net:7027 | 200 |

Feature: Online Payments
In order to install Online Payments
As an architect
I want to validate the provisioned test implementation

Scenario Outline: Validate Routing of pay.test.ami.co.nz
Given The environment is <env>
When an index.html request is sent to <domain>
Then the result should be <result>

Examples:
| env | domain | result |
| DEV | https://pay.ami.dev.ldstatdv.net | 200 |
| W12DZHIIS020 | https://W12DZHIIS020.lddmzdv.net:4443 | 200 |
| W12DZHIIS021 | https://W12DZHIIS020.lddmzdv.net:4443 | 200 |
| DEV | https://pay.dev.ami.co.nz | 200 |


Scenario Outline: Validate Routing of anonymous-access-token
Given The environment is <env>
When a anonymous-access-token request is sent to <domain>
Then the result should be <result>

Examples:
| env | domain | result |
| W12DZHIIS020 | https://W12DZHIIS020.lddmzdv.net:7029 | 200 |
| W12DZHIIS021 | https://W12DZHIIS020.lddmzdv.net:7029 | 200 |
| DEV_INTERNAL | https://api.dev.ldstatdv.net | 200 |
| DEV | https://api.dev.iag.co.nz | 200 |
| DIT_INTERNAL | https://api.dit.ldstatdv.net | 200 |
| DIT | https://api.dit.iag.co.nz | 200 |
| STAGING_INTERNAL | https://api.staging.ldstatdv.net | 200 |
| STAGING | https://api.test.ldstatmk.net | 200 |
| PREPROD_INTERNAL | https://api.test.ldstatmk.net | 200 |
| PREPROD | https://api.test.iag.co.nz | 200 |
| PROD_INTERNAL | https://api.live.ldstatdv.net | 200 |
| PROD | https://api.live.iag.co.nz | 200 |



Scenario Outline: Validate Routing of DPS Failsafe
Given The environment is <env>
When a failsafe request is sent to <domain>
Then the result should be <result>

Examples:
| env | domain | result |
| W12DZHIIS020 | https://W12DZHIIS020.lddmzdv.net:7029 | 200 |
| W12DZHIIS021 | https://W12DZHIIS020.lddmzdv.net:7029 | 200 |
| DEV_INTERNAL | https://api.dev.ldstatdv.net | 200 |
| DEV | https://api.dev.iag.co.nz | 200 |
| DIT_INTERNAL | https://api.dit.ldstatdv.net | 200 |
| DIT | https://api.dit.iag.co.nz | 200 |
| STAGING_INTERNAL | https://api.staging.ldstatdv.net | 200 |
| STAGING | https://api.test.ldstatmk.net | 200 |
| PREPROD_INTERNAL | https://api.test.ldstatmk.net | 200 |
| PREPROD | https://api.test.iag.co.nz | 200 |
| PROD_INTERNAL | https://api.live.ldstatdv.net | 200 |
| PROD | https://api.live.iag.co.nz | 200 |

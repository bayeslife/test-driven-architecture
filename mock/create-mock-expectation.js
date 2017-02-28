var mockServer = require('mockserver-client'),
    mockServerClient = mockServer.mockServerClient;

  mockServerClient("localhost", 1080).mockAnyResponse(
      {
          'httpRequest': {
              'method': 'OPTIONS'
          },
          'httpResponse': {
              'statusCode': 200,
              'headers': [
                {
                  'name': 'Access-Control-Allow-Origin', 'values': ['null']
                },
                {
                  'name': 'Access-Control-Allow-Method','values': ['POST' ]
                },
                {
                  'name': 'Access-Control-Allow-Headers', 'values': ['content-type',"authorization"]
                },
                { 'name': 'Access-Control-Request-Headers', 'values': ['content-type',"authorization"]},
              ],
          },
          'times': {
              'unlimited': true
          }
      }
  );

mockServerClient("localhost", 1080).mockAnyResponse(
    {
        'httpRequest': {
            'method': 'POST',
            'path': '/direct/v1605/anonymous-access-token'
        },
        'httpResponse': {
            'statusCode': 200,
            'headers': [
              {
                'name': 'Access-Control-Allow-Origin', 'values': ['null']
              },
              {
                'name': 'Access-Control-Allow-Method','values': ['*' ]
              },
              {
                'name': 'Access-Control-Allow-Headers', 'values': ['content-type',"authorization"]
              }
            ],
            'body': JSON.stringify({ token: 'atoken' }),
            'delay': {
                'timeUnit': 'MILLISECONDS',
                'value': 100
            }
        },
        'times': {
            'unlimited': true
        }
    }
);

mockServerClient("localhost", 1080).mockAnyResponse(
    {
        'httpRequest': {
            'method': 'GET',
            'path': '/enterprise/payments/attempts/result'
        },
        'httpResponse': {
            'statusCode': 200,
            'headers': [
              {
                'name': 'Access-Control-Allow-Origin', 'values': ['null']
              },
              {
                'name': 'Access-Control-Allow-Method','values': ['GET' ]
              },
              {
                'name': 'Access-Control-Allow-Headers', 'values': ['content-type',"authorization"]
              }
            ],
            'body': JSON.stringify({}),
            'delay': {
                'timeUnit': 'MILLISECONDS',
                'value': 100
            }
        },
        'times': {
            'unlimited': true
        }
    }
);

mockServerClient("localhost", 1080).mockAnyResponse(
    {
        'httpRequest': {
            'method': 'GET',
            'path': '/'
        },
        'httpResponse': {
            'statusCode': 200,
            'headers': [
              {
                'name': 'Access-Control-Allow-Origin', 'values': ['null']
              },
              {
                'name': 'Access-Control-Allow-Method','values': ['GET' ]
              },
              {
                'name': 'Access-Control-Allow-Headers', 'values': ['content-type',"authorization"]
              }
            ],
            'body': "<html>Test</html>",
            'delay': {
                'timeUnit': 'MILLISECONDS',
                'value': 100
            }
        },
        'times': {
            'unlimited': true
        }
    }
);

mockServerClient("localhost", 1080).mockAnyResponse(
    {
        'httpRequest': {
            'method': 'GET',
            'path': '/direct/customer-amount-owed-description'
        },
        'httpResponse': {
            'statusCode': 200,
            'headers': [
              {
                'name': 'Access-Control-Allow-Origin', 'values': ['null']
              },
              {
                'name': 'Access-Control-Allow-Method','values': ['*' ]
              },
              {
                'name': 'Access-Control-Allow-Headers', 'values': ['content-type',"authorization"]
              }
            ],
            'body': JSON.stringify({ amount: "123.00"}),
        },
        'times': {
            'unlimited': true
        }
    }
);


mockServerClient("localhost", 1080).mockAnyResponse(
    {
        'httpRequest': {
            'method': 'POST',
            'path': '/enterprise/payments/v1605/attempts'
        },
        'httpResponse': {
            'statusCode': 200,
            'headers': [
              {
                'name': 'Access-Control-Allow-Origin', 'values': ['null']
              },
              {
                'name': 'Access-Control-Allow-Method','values': ['*' ]
              },
              {
                'name': 'Access-Control-Allow-Headers', 'values': ['content-type',"authorization"]
              }
            ],
            'body': JSON.stringify({ policyNumber: "ABCD12345",paymentChannel: "ONLINE_PAYMENT"}),
        },
        'times': {
            'unlimited': true
        }
    }
);

mockServerClient("localhost", 1080).mockAnyResponse(
    {
        'httpRequest': {
            'method': 'GET',
            'path': '/enterprise/payments/v1605/results'
        },
        'httpResponse': {
            'statusCode': 200,
            'headers': [
              {
                'name': 'Access-Control-Allow-Origin', 'values': ['null']
              },
              {
                'name': 'Access-Control-Allow-Method','values': ['*' ]
              },
              {
                'name': 'Access-Control-Allow-Headers', 'values': ['content-type',"authorization"]
              }
            ],
            'body': JSON.stringify({result: "000001000080974300490c3e5c7b17f7"}),
        },
        'times': {
            'unlimited': true
        }
    }
);

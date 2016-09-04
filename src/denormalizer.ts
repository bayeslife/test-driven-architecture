#!/usr/bin/env node

var debug = require('debug')('denormalizer');

import Promise = require('bluebird');

export default function denormalize(solution: any, environments: any) : Promise<any>{

  console.log(solution);

  return Promise.resolve(solution)
}

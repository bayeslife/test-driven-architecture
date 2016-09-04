#!/usr/bin/env node

import Promise = require('bluebird')

//import { parse } from 'handlebars';
import * as h  from 'handlebars';
//import handlebars = require( 'handlebars' );


var ast = h.parse("../src/handlebars/index.hbs");

console.log(ast);

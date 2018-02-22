#!/usr/bin/env node

require('@babel/register')
require('@babel/polyfill')

require('app-module-path').addPath(
  require('path').join(__dirname, 'app')
)
require('app')

#!/usr/bin/env node

// removeIf(production)
require('@babel/register')
require('@babel/polyfill')
// endRemoveIf(production)

require('app-module-path').addPath(
  require('path').join(__dirname, 'app')
)
require('app')

#!/usr/bin/env node
'use strict';

import { MnuClient } from '../src/core/client.js';

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage: mnu category:page');
  console.log('       mnu run path/to/file.mn');
  console.log('Example: mnu cli:git');
  process.exit(0);
}

const client = new MnuClient();
client.start(args);

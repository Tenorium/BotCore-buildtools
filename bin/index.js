#!/usr/bin/env node

import {checkUpdates} from "./autoupdate.js";
import yargs from "yargs";
import {hideBin} from "yargs/helpers";
import {run} from "./commands/build.js";
import {EOL} from "os";

await checkUpdates();
console.log(EOL);

await yargs(hideBin(process.argv))
    .usage('botcore-build [-v] <command> [options]')
    .option('v', {
        alias: 'verbose',
        describe: 'Verbose output',
        type: 'boolean'
    })
    .command(
        'build',
        'Build package and version metadata',
        () => {},
         async args => {
            await run(args);
        }
    )
    .help()
    .parse();
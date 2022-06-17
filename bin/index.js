#!/usr/bin/env node

(async function(){
    const {checkUpdates} = await import("./autoupdate.mjs");
    const yargs = require("yargs");
    const {hideBin} = require("yargs/helpers");
    const {run} = await import("./commands/build.mjs");
    const {EOL} = require("os")

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
})();
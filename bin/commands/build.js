import * as readline from 'node:readline/promises';
import AdmZip from "adm-zip";
import colors from 'colors/safe.js';
const {green,bold} = colors;
import sha256 from "sha256-file";
import globSync from "glob/sync.js";
import {join, relative} from "path";
import {lstatSync, writeFileSync} from "fs";

const SpinnerClass = (await import("clui")).default.Spinner;

const DEPENDENCY_QUESTION = 'Enter dependency name and version (cli@latest for example) enter "done" for continue: ';
const NODE_DEPENDENCY_QUESTION = 'Enter ' + bold('NodeJS') + ' dependency name and version (discord.js@13.6.0 for example) enter "done" for continue: '

async function getDependencies(isNodeJs,rl) {
    let dependencies = {};

    let dependency = await rl.question(isNodeJs ? NODE_DEPENDENCY_QUESTION : DEPENDENCY_QUESTION);

    let [dependencyName, dependencyVersion] = dependency.split('@');

    while (dependency !== 'done') {
        dependencies[dependencyName] = dependencyVersion ?? 'latest';

        dependency = await rl.question("Dependency: ");
        [dependencyName, dependencyVersion] = dependency.split('@');
    }

    return dependencies;
}

export const run = async function(args) {
    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let spinner = new SpinnerClass("Packing files...");
    spinner.start();

    let filePaths = globSync(join(process.cwd(), '/**/*')).filter(value => lstatSync(value).isFile());

    let archive = new AdmZip();
    archive.addLocalFolder('.');
    archive.writeZip('build.zip');
    spinner.stop();

    let version = await rl.question('Enter version of package: ');
    let hashsum = sha256('build.zip');
    let dependencies = await getDependencies(false, rl);
    let nodeDependencies = await getDependencies(true, rl);
    let files = {};

    filePaths.forEach(value => {
        files[relative(process.cwd(),value)] = {
            hashsum: sha256(value),
            "uninstall-action": "remove"
        }
    });

    let metadata = {
        version,
        "sha-256": hashsum,
        dependencies,
        nodeDependencies,
        files
    }

    writeFileSync('metadata.json', JSON.stringify(metadata), {
        encoding: 'utf8'
    });

    console.log(green('BUILD SUCCESSFUL'));

    rl.close();
}
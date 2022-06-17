import AutoGitUpdate from "auto-git-update";
import * as path from "path";
import * as os from "os";
import pkg from 'colors/safe.js';
const {green, red} = pkg;

const SpinnerClass = (await import("clui")).default.Spinner;

export const checkUpdates = async function() {
    let spinner = new SpinnerClass("Checking updates...");
    spinner.start();

    /**
     *
     * @type {Config}
     */
    let config = {
        repository: "https://github.com/Tenorium/BotCore-buildtools",
        branch: "latest",
        tempLocation: path.join(os.tmpdir(), 'botcore-buildtools')
    };

    let updater = new AutoGitUpdate(config);

    if (! (await updater.compareVersions()).upToDate) {
        spinner.message("Upgrading...");
        let result = updater.forceUpdate();
        if (result) {
            spinner.stop();
        } else {
            spinner.stop();
            console.log(`Updates install ${red("ERROR")}`);
        }
    }

    spinner.stop();
}
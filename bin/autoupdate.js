import AutoGitUpdate from "auto-git-update";
import clear from "clear";
import colors from "colors";
import * as path from "path";
import {ThrottleGroup} from "speed-limiter";
import * as os from "os";

const SpinnerClass = (await import("clui")).default.Spinner;

export const checkUpdates = async function() {
    let rate = 1; //B/s
    let throttleGroup = new ThrottleGroup({rate});

    throttleGroup.throttle();

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
            clear();
            console.log(`Updates installed ${colors.green("SUCCESSFULLY")}`);
        }
    }

    spinner.stop();
}
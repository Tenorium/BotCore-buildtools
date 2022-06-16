import AutoGitUpdate from "auto-git-update";
import clear from "clear";
import colors from "colors";

const SpinnerClass = (await import("clui")).default.Spinner;

export const checkUpdates = async function() {
    let spinner = new SpinnerClass("Checking updates...");
    spinner.start();

    /**
     *
     * @type {Config}
     */
    let config = {
        repository: "https://github.com/Tenorium/BotCore.git",
        branch: "latest"
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
}
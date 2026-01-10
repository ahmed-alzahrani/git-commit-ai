import { simpleGit } from "simple-git";
import { GIT, ERROR_MESSAGES } from "./config/constants";

export async function checkRepo(): Promise<boolean> {
    const git = simpleGit();

    try {
        await git.revparse(['--is-inside-work-tree']);
        return true;
    } catch (error) {
        return false;
    }
}

export async function getDiff(): Promise<string> {
    const diff = await simpleGit().diff([...GIT.DIFF_FLAGS]);

    if (!diff || diff.trim() === '') {
        throw new Error(ERROR_MESSAGES.NO_STAGED_CHANGES);
      }
      return diff;
}

export async function commit(message: string): Promise<void> {
    await simpleGit().commit(message);
}
import { simpleGit } from "simple-git";
import { GIT, ERROR_MESSAGES } from "./config/constants";

const git = simpleGit();

export async function checkRepo(): Promise<boolean> {
    try {
        await git.revparse([...GIT.REVPARSE_FLAGS]);
        return true;
    } catch (error) {
        return false;
    }
}

export async function getDiff(): Promise<string> {
    const diff = await git.diff([...GIT.DIFF_FLAGS]);

    if (!diff || diff.trim() === '') {
        throw new Error(ERROR_MESSAGES.NO_STAGED_CHANGES);
    }
    return diff;
}

export async function commit(message: string): Promise<void> {
    await git.commit(message);
}
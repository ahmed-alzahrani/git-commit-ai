import { simpleGit } from "simple-git";

export async function checkRepo() : Promise<boolean> {
    const git = simpleGit();

    try {
        await git.revparse(['--is-inside-work-tree']);
        return true;
    } catch (error) {
        return false;
    }
}

export async function getDiff() : Promise<string> {
    const diff = await simpleGit().diff(['--cached']);

    if (!diff || diff.trim() === '') {
        throw new Error('No staged changes');
      }
      return diff;
}

export async function commit(message: string) {
    await simpleGit().commit(message);
}
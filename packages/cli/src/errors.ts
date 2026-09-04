/**
 * Failure reporting shared by every command: whether a failure is the caller's to fix, and
 * how it is rendered.
 *
 * Deliberately dependency-free so any module can tag an error without pulling in a command.
 */
/**
 * Mark an error as something the person running the CLI can fix themselves.
 *
 * Those failures are not friction with a command, so they must not invite a feedback
 * report: doing so would bury the real reports under noise.
 */
export function markUserActionable<E extends Error>(error: E): E {
    (error as E & { userActionable?: boolean }).userActionable = true;
    return error;
}

/**
 * Render a command failure, inviting a feedback report when the failure looks like a
 * problem with the command rather than with how it was called.
 *
 * This is where an agent is most likely to act on the invitation, having just hit the
 * problem; the command's own help is only read by someone already looking for it.
 */
export function formatCommandFailure(error: unknown, argv: readonly string[]): string {
    const message = error instanceof Error ? error.message : String(error);
    return shouldInviteReport(error, argv)
        ? `${message}\n\nIf this looks like a problem with the command rather than your input, report it with \`gitbook feedback\` and carry on.`
        : message;
}

function shouldInviteReport(error: unknown, argv: readonly string[]): boolean {
    // Never ask an agent to report that reporting failed.
    if (argv[0] === 'feedback') {
        return false;
    }

    const candidate = error as { userActionable?: boolean; code?: unknown } | null;
    if (candidate?.userActionable) {
        return false;
    }

    // Commander raises usage errors (unknown command, missing argument) for mistakes in the
    // invocation, which the caller fixes rather than reports.
    return !(typeof candidate?.code === 'string' && candidate.code.startsWith('commander.'));
}

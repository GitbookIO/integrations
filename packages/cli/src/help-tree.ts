import { Command, Help } from 'commander';

/**
 * Nested command-tree help.
 *
 * Commander's default `--help` only lists a command's *immediate* children, so
 * deeper subgroups (e.g. `organizations sites`, `spaces content pages`) are
 * invisible until you drill in one level at a time. This module appends a
 * "Command groups (nested)" section to every group's help that reveals the
 * nested subgroup structure, so you can discover that `organizations sites`
 * exists from `gitbook --help` without hunting.
 *
 * Two layouts, so the big root listing stays scannable without scrolling while
 * deeper pages read naturally:
 *   - root `gitbook --help`: COMPACT — one line per top-level group, its
 *     subgroups listed comma-separated (and wrapped) alongside it.
 *   - any subgroup's `--help`: INDENTED — that group's subgroups one per line.
 *
 * It's attached uniformly by walking the Commander tree at runtime, so there's
 * nothing to keep in sync as commands change. Only *subgroups* are listed — leaf
 * verbs (list/get/create/…) are omitted to keep the tree structural; each
 * group's own `--help` still lists its verbs.
 */

// How many further levels of nested subgroups the INDENTED (subgroup-page)
// layout shows beneath the helped command's direct children. 1 reveals the
// immediate subgroups without drilling in while keeping output bounded — depth 2
// explodes on wide subtrees like `sites` (~30 nested collections).
const TREE_DEPTH = 1;

const INDENT = '  ';

// A group's subgroups: visible children that themselves have visible children.
// Leaf verb commands (and the implicit `help` command) have no children and are
// excluded. Sorted alphabetically via the shared, sort-enabled Help instance.
function subgroups(cmd: Command, helper: Help): Command[] {
    return helper.visibleCommands(cmd).filter((child) => helper.visibleCommands(child).length > 0);
}

// ─── Indented layout (subgroup pages) ──────────────────────────────────────────

function renderIndented(
    cmd: Command,
    helper: Help,
    indent: number,
    depthRemaining: number,
    out: string[],
): void {
    for (const child of subgroups(cmd, helper)) {
        out.push(`${INDENT.repeat(indent)}${child.name()}`);
        if (depthRemaining > 0) {
            renderIndented(child, helper, indent + 1, depthRemaining - 1, out);
        }
    }
}

function indentedSection(cmd: Command, helper: Help): string {
    const out: string[] = [];
    renderIndented(cmd, helper, 1, TREE_DEPTH, out);
    return `\nCommand groups (nested):\n${out.join('\n')}\n`;
}

// ─── Compact layout (root) ──────────────────────────────────────────────────--

// Greedily pack comma-separated tokens into lines no wider than `width`.
function wrapTokens(tokens: string[], width: number): string[] {
    const lines: string[] = [];
    let cur = '';
    tokens.forEach((tok, i) => {
        const piece = i < tokens.length - 1 ? `${tok},` : tok;
        if (cur === '') {
            cur = piece;
        } else if (cur.length + 1 + piece.length <= width) {
            cur += ` ${piece}`;
        } else {
            lines.push(cur);
            cur = piece;
        }
    });
    if (cur) lines.push(cur);
    return lines;
}

function compactSection(cmd: Command, helper: Help): string {
    const groups = subgroups(cmd, helper);
    const rows = groups.map((g) => ({
        name: g.name(),
        children: subgroups(g, helper).map((c) => c.name()),
    }));

    const nameWidth = Math.max(...rows.map((r) => r.name.length));
    const valueCol = INDENT.length + nameWidth + 2;
    const termWidth = Math.min(process.stdout.columns || 80, 100);
    // Leave room for the value column; never wrap narrower than 20 cols.
    const wrapWidth = Math.max(20, termWidth - valueCol);

    const lines: string[] = [];
    for (const row of rows) {
        const label = INDENT + row.name.padEnd(nameWidth + 2);
        if (row.children.length === 0) {
            lines.push(label.trimEnd());
            continue;
        }
        const wrapped = wrapTokens(row.children, wrapWidth);
        lines.push(label + wrapped[0]);
        for (let i = 1; i < wrapped.length; i++) {
            lines.push(' '.repeat(valueCol) + wrapped[i]);
        }
    }

    return `\nCommand groups (nested):\n${lines.join('\n')}\n`;
}

// ─── Wiring ─────────────────────────────────────────────────────────────────--

/**
 * Attach the nested-tree help section to `program` (compact) and every group
 * beneath it (indented).
 */
export function installCommandTreeHelp(program: Command): void {
    const helper = new Help();
    // Render subgroups alphabetically rather than in registration order.
    helper.sortSubcommands = true;

    const attach = (cmd: Command, isRoot: boolean): void => {
        // Only groups with nested subgroups get a tree; a group whose children
        // are all leaf verbs has nothing extra to reveal.
        if (subgroups(cmd, helper).length > 0) {
            cmd.addHelpText('after', () =>
                isRoot ? compactSection(cmd, helper) : indentedSection(cmd, helper),
            );
        }
        for (const child of cmd.commands) {
            attach(child, false);
        }
    };

    attach(program, true);
}

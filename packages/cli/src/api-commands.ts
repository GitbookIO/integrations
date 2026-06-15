import { Command } from 'commander';

/**
 * Hand-written companion to the auto-generated `generated-commands.ts`.
 *
 * The generator can only express operations that exist in the OpenAPI spec.
 * Commands that don't map cleanly onto a single spec operation — multi-step
 * flows, file/URL handling, bespoke output — live here instead, and are
 * registered onto the same parent Command as the generated ones so they are
 * all discoverable together.
 *
 * This file is never touched by the generator.
 */
export function registerCustomCommands(program: Command): void {
    // Custom commands registered here
}

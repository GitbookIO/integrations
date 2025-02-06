import { OpenAPIV3 } from "@scalar/openapi-types";

/**
 * Get the title for a tag.
 */
export function getTagTitle(tag: OpenAPIV3.TagObject) {
    return (
        tag['x-page-title'] ?? improveTagName(tag.name ?? '')
    )
}

/**
 * Improve a tag name to be used as a page title:
 * - Capitalize the first letter
 * - Split on - and capitalize each word
 */
export function improveTagName(tagName: string) {
    return tagName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

import { IntegrationError } from '@gitbook/runtime';
import type { FormspreeBodyData } from './types';

// Submit form data to Formspree
export async function handleSubmit(formspreeId: string, body: FormspreeBodyData) {
    const cleanedFormBody = removeEmptyValues(body);
    const normalizedEndpoint = normalizeFormspreeEndpoint(formspreeId);

    const response = await fetch(normalizedEndpoint, {
        method: 'POST',
        body: JSON.stringify(cleanedFormBody),
        headers: {
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        if (response.status === 422) {
            throw new IntegrationError('invalid_input');
        }
        if ([401, 403, 404].includes(response.status)) {
            throw new IntegrationError('configuration_required');
        }
        throw new Error(`Formspree API error: HTTP ${response.status}`);
    }
    return response;
}

// Clean data object being submitted
export function removeEmptyValues(object: FormspreeBodyData) {
    return Object.fromEntries(Object.entries(object).filter(([, value]) => !!value));
}

// Normalize Formspree endpoint URL
export function normalizeFormspreeEndpoint(input: string): string {
    // Check if input is already a full URL
    if (input.startsWith('https://formspree.io') || input.startsWith('http://formspree.io')) {
        return input;
    }
    // Otherwise, treat it as an ID and prepend the Formspree endpoint
    return `https://formspree.io/f/${input}`;
}

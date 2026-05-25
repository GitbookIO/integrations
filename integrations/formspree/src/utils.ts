import type { FormspreeBodyData } from './types';

// Submit form data to Formspree
export async function handleSubmit(formspreeId: string, body: FormspreeBodyData) {
    const cleanedFormBody = removeEmptyValues(body);
    const normalizedEndpoint = normalizeFormspreeEndpoint(formspreeId);

    return fetch(normalizedEndpoint, {
        method: 'POST',
        body: JSON.stringify(cleanedFormBody),
        headers: {
            Accept: 'application/json',
        },
    });
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

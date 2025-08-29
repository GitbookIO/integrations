import type { FormspreeBodyData } from './types';

// Submit form data to Formspree
export async function handleSubmit(formspreeId: string, body: FormspreeBodyData) {
    const cleanedFormBody = removeEmptyValues(body);

    return fetch(formspreeId, {
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

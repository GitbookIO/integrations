// Handle errors better

export async function handleSubmit(formspree_id, body) {
    const cleanedFormBody = await removeEmptyValues(body);

    fetch(formspree_id, {
        method: 'POST',
        body: JSON.stringify({ data: cleanedFormBody, form: 'GitBook Integration' }),
        headers: {
            Accept: 'application/json',
        },
    })
        .then((response) => {
            if (response.ok) {
                return true;
            } else {
                return false;
            }
        })
        .catch((error) => {
            console.error(error);
        });
}

// Clean data object being submitted
export async function removeEmptyValues(object) {
    for (const key in object) {
        if (object.hasOwnProperty(key)) {
            const value = object[key];
            if (value === null || value === undefined || value === '') {
                delete object[key];
            }
        }
    }
    return object;
}

/**
 * Save the space configuration for the current space installation.
 */
export async function saveSpaceConfiguration(context, state) {
    const { api, environment } = context;
    const spaceInstallation = environment.spaceInstallation;

    console.log('state trying to be saved: ', state);

    // Save the space installation configuration
    const { data } = await api.integrations.updateIntegrationSpaceInstallation(
        spaceInstallation.integration,
        spaceInstallation.installation,
        spaceInstallation.space,
        {
            configuration: {
                ...spaceInstallation.configuration,
                ...state,
            },
        }
    );

    console.log('Just saved data: ', data.configuration);
}

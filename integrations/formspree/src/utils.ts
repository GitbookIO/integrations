// Handle errors better

export async function handleSubmit(formspree_id, email) {
    fetch(formspree_id, {
        method: 'POST',
        body: JSON.stringify({ email, form: 'GitBook Integration' }),
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

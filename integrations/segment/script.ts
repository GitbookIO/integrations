
addEventListener('space:view', async (event) => {
    const writeKey = environment.spaceInstallation.configuration.write_key;
    if (!writeKey) {
        return;
    }

    await fetch('https://api.segment.io/v1/track', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${btoa(`${writeKey}:`)}`
        },
        body: JSON.stringify({
            "anonymousId": event.visitorId,
            "event": "gitbook.space.view",
            "properties": {
                
            },
            "context": {
                "ip": event.visitorIp
            },
        })
    })
});

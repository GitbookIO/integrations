(function (d) {
    const config = '<TO_REPLACE>'; // Will be replaced with JSON config
    
    // Create and inject the widget script
    const script = d.createElement('script');
    script.async = true;
    script.src = 'https://widget.gurubase.io/widget.latest.min.js';
    script.id = 'guru-widget-id';
    
    // Add configuration attributes
    const parsedConfig = JSON.parse(config);
    Object.entries(parsedConfig).forEach(([key, value]) => {
        if (value !== undefined) {
            if (key === 'margins') {
                // Handle margins object separately
                if (value.bottom) script.setAttribute('data-margin-bottom', value.bottom);
                if (value.right) script.setAttribute('data-margin-right', value.right);
            } else {
                // Convert camelCase to kebab-case for data attributes
                const attr = 'data-' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
                script.setAttribute(attr, 
                    typeof value === 'boolean' ? value.toString() : value
                );
            }
        }
    });

    // Inject the script into the page
    d.getElementsByTagName('head')[0].appendChild(script);
})(document);

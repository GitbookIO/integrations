import { loadSandpackClient, SandboxSetup, ClientOptions } from '@codesandbox/sandpack-client';

(async function (document) {
    const iframe = document.getElementById("iframe");

    const content: SandboxSetup = {
        files: {
            "/package.json": { code: JSON.stringify({
                    main: "index.js",
                    dependencies: { uuid: "latest" },
                })},

            "/index.js": { code: `console.log(require('uuid'))` }
        },
        environment: "vanilla"
    };

    const options: ClientOptions = {};

    const client = await loadSandpackClient(
        iframe,
        content,
        options
    );

    client.updateSandbox({
        files: {
            "/index.js": {
                code: `console.log('New Text!')`,
            },
        },
        entry: "/index.js",
        dependencies: {
            uuid: "latest",
        },
    });
})(document)

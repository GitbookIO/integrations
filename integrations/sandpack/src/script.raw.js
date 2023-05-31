import { loadSandpackClient, SandboxSetup, ClientOptions } from '@codesandbox/sandpack-client';

(async function (document) {
    let divElement = document.createElement("div");
    divElement.id = "iframe";
    let bodyElement = document.getElementsByTagName("body")[0];
    bodyElement.appendChild(divElement);

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

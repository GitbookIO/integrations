import sdk from '@stackblitz/sdk';

export const createProject = async () => {
    try {
        await sdk.embedProject(
            'stackblitz',
            {
                title: 'Node Starter',
                description: 'A basic Node.js project',
                template: 'node',
                files: {
                    'index.js': `console.log('Hello World!');`,
                    'package.json': `{
                    "name": "my-project",
                    "scripts": { "hello": "node index.js", "start": "serve node_modules" },
                    "dependencies": { "serve": "^14.0.0" },
                    "stackblitz": { "installDependencies": true, "startCommand": "npm start" },
                }`,
                },
            },
            {
                clickToLoad: true,
                openFile: 'index.js',
                terminalHeight: 50,
            }
        );
    } catch (e) {
        console.log('ERROR_CAUGHT: ', e);
    }
};

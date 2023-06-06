import sdk from '@stackblitz/sdk';
// THIS IS OPTION FIVE - OPEN PROJECT (Creates a new project and opens it in a new tab (or in the current window).)
// (project, openOptions)
export const createProject = async () => {
    console.log('CREATE_PROJECT');
    sdk.openProject(
        {
            title: 'Banana Project',
            description: 'Blank starter project for building ES6 apps.',
            template: 'javascript',
            files: {
                'index.html': `<div id='app'></div>`,
                'index.js': `import './style.css';
const appDiv = document.getElementById('app');
appDiv.innerHTML = '<h1>JS Starter</h1>';`,
                'style.css': `body { font-family: system-ui, sans-serif; }`,
            },
            settings: {
                compile: {
                    trigger: 'auto',
                    clearConsole: false,
                },
            },
        },
        {
            newWindow: false,
            openFile: ['index.js', 'index.html,style.css'],
        }
    );
};

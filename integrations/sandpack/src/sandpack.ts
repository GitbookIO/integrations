import { PreviewController } from 'static-browser-server';

export const getPreviewUrl = async () => {
    const files = new Map([['index.html', 'Hello world!']]);

    const controller = new PreviewController({
        baseUrl: 'https://preview.sandpack-static-server.codesandbox.io',
        // Function to get the file content for the server this can also be async
        getFileContent: (filepath) => {
            const content = files.get(filepath);
            if (!content) {
                throw new Error('File not found');
            }
            return content;
        },
    });

    return await controller.initPreview();
};

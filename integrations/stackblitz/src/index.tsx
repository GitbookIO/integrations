import { createIntegration, createComponent } from '@gitbook/runtime';

const defaultContent = 'Starter Javascript Project';

const diagramBlock = createComponent<
    {
        content?: string;
    },
    {
        content: string;
    }
>({
    componentId: 'diagram',
    initialState: (props) => {
        return {
            content: props.content || defaultContent,
        };
    },
    async render(element, { environment }) {
        const { editable } = element.context;
        const { content } = element.state;

        element.setCache({
            maxAge: 86400,
        });

        const output = (
            <webframe
                source={{
                    url: environment.integration.urls.publicEndpoint,
                }}
                aspectRatio={16 / 9}
                data={{
                    content: element.dynamicState('content'),
                }}
            />
        );

        return (
            <block>
                {editable ? (
                    <codeblock
                        state="content"
                        content={content}
                        syntax="stackblitz"
                        onContentChange={{
                            action: '@editor.node.updateProps',
                            props: {
                                content: element.dynamicState('content'),
                            },
                        }}
                        footer={[output]}
                    />
                ) : (
                    output
                )}
            </block>
        );
    },
});

// Required Form Fields

// project[title] = Project title
// project[description] = Project description
// project[files][FILE_PATH] = Contents of file, specify file path as key
// project[files][ANOTHER_FILE_PATH] = Contents of file, specify file path as key
// project[dependencies] = JSON string of dependencies field from package.json
// project[template] = Can be one of: typescript, angular-cli, create-react-app, javascript

export default createIntegration({
    fetch: async () => {
        return new Response(
            `<html lang='en'>
<head></head>
<body>

<form id='mainForm' method='post' action='https://stackblitz.com/run' target='_self'>
<input type='hidden' name='project[files][index.ts]' value="import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/scan';

var button = document.querySelector('button');
Observable.fromEvent(button, 'click')
  .scan((count: number) => count + 1, 0)
  .subscribe(count => console.log(\`Clicked times\`));
">
<input type='hidden' name='project[files][index.html]' value='<button>Click Me</button>
'>
<input type='hidden' name='project[description]' value='RxJS Example'>
<input type='hidden' name='project[dependencies]' value='{&quot;rxjs&quot;:&quot;5.5.6&quot;}'>
<input type='hidden' name='project[template]' value='typescript'>
<input type='hidden' name='project[settings]' value='{&quot;compile&quot;:{&quot;clearConsole&quot;:false}}'>
</form>
<script>document.getElementById("mainForm").submit();</script>

</body></html>`,
            {
                headers: {
                    'Content-Type': 'text/html',
                    'Cache-Control': 'public, max-age=86400',
                },
            }
        );
    },
    components: [diagramBlock],
});

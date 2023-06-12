export const fetchHTML = async () => {
    const html = `<html lang='en'>
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
    </body>
  </html>`;

    const response = new Response(html, {
        headers: {
            'Content-Type': 'text/html',
            'Cache-Control': 'public, max-age=86400',
        },
    });

    return response;
};


export const webFrameHTML: string = `
<html>
    <style>
        * {
            margin: 0;
            padding: 0;
        }
    </style>
    <body>
        <div id="notebook"></div>
        <script src="https://embed.runkit.com"></script>
        <script>var s=window.top,d=!1,n=null,r=null;console.info("runkit-embed: webframe initialize");function a(e){s.postMessage({action:e},"*")}async function c(e){let o=await e.getSource(),t=await e.getNodeVersion();!o||o===r||(r=o,a({action:"@editor.node.updateProps",props:{content:o,nodeVersion:t}}))}function u(e){if(!e.data)return;let{content:o,nodeVersion:t,editable:i}=e.data.state;if(!n){l(o,t);return}d=!i,o&&n.setSource(o),t&&n.setNodeVersion(t)}function b(e){console.info("runkit-embed: runkit iframe loaded"),d||setInterval(c,1e3,e)}function f(e,{height:o}){let i={aspectRatio:document.getElementById("notebook").offsetWidth/o,maxHeight:o};a({action:"@webframe.resize",size:i})}function l(e,o){n=window.RunKit.createNotebook({element:document.getElementById("notebook"),source:e,nodeVersion:o,onLoad:b,onResize:f})}window.addEventListener("message",e=>{e.origin!=="https://runkit.com"&&u(e)});a({action:"@webframe.ready"});
</script>
    </body>
</html>

`

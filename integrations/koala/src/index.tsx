import {
    createIntegration,
    createComponent,
    FetchEventCallback,
    RuntimeContext,
  } from "@gitbook/runtime";

  type IntegrationContext = {} & RuntimeContext;
  type IntegrationBlockProps = {};
  type IntegrationBlockState = { message: string };
  type IntegrationAction = { action: "click" };

  const handleFetchEvent: FetchEventCallback<IntegrationContext> = async (
    request,
    context
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { api } = context;
    const user = api.user.getAuthenticatedUser();

    return new Response(JSON.stringify(user));
  };

  const exampleBlock = createComponent<
     IntegrationBlockProps,
     IntegrationBlockState,
     IntegrationAction,
     IntegrationContext
  >({
    componentId: "koala",
    initialState: (props) => {
      return {
        message: "Click Me",
      };
    },
    action: async (element, action, context) => {
      switch (action.action) {
        case "click":
          console.log("Button Clicked");
          return {};
      }
    },
    render: async (element, context) => {
      return (
        <block>
          <button label={element.state.message} onPress={{ action: "click" }} />
        </block>
      );
    },
  });

  export default createIntegration({
    fetch: handleFetchEvent,
    components: [exampleBlock],
    events: {},
  });

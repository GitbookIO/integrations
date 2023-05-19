# Web APIs

GitBook's [Runtime API](https://www.npmjs.com/package/@gitbook/runtime) allows you to use a few Web APIs directly out of the box.

## `fetch()`

Integrations communicate with the outside world over HTTP. Your integration can send async HTTP requests through HTTP Fetch. See the [MDN docs](https://developer.mozilla.org/en-US/docs/Web/API/Fetch\_API) to learn more.

**Example**:

```typescript
const resp = await fetch(
    `https://example.com/api/endpoint`,
    {
        headers: {
            Authorization: `<example-auth>`,
            Accept: 'application/json',
        },
    }
);
```

## `Response`

The **`Response`** interface of the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch\_API) represents the response to a request. See the [MDN docs](https://developer.mozilla.org/en-US/docs/Web/API/Response) to learn more.

**Example**:

```typescript
const handleFetchEvent = async (request, context) => {
    return new Response({message: "Hello World"});
};
```

## `Request`

The **`Request`** interface of the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch\_API) represents a resource request. See the [MDN docs](https://developer.mozilla.org/en-US/docs/Web/API/Request) to learn more.

**Example**:

```typescript
const request = new Request("https://example.com", {
  method: "POST",
  body: '{"message": "Hello World"}',
});

```

## `URL`

The **`URL()`** constructor returns a newly created [`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL) object representing the URL defined by the parameters. See the [MDN docs](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) to learn more.

**Example**:

```typescript
// Base URLs:
let baseUrl = "https://gitbook.com/";

let integrations = new URL("/integrations", baseUrl);
// => 'https://gitbook.com/integrations'
```

## `URLSearchParams`

The **`URLSearchParams`** interface defines utility methods to work with the query string of a URL. See the [MDN docs](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) to learn more.

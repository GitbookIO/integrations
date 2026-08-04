# Visitor Claims Webframe Demo

Dev/test integration for validating that GitBook/GBX passes adaptive visitor context into ContentKit webframes.

The integration exposes one block, `visitorClaimsWebframeDemo`, which renders a self-contained webframe at `/webframe`. The webframe displays:

- The full posted ContentKit webframe state.
- `state.visitor`.
- `state.visitor.claims`.
- `state.visitor.isSet`.
- Regular webframe `data` values, including `label` and `mode`, as part of the full state.

## Test

1. Enable and configure adaptive content for the target site/space.
2. Install this integration in the target space.
3. Add the **Visitor Claims Demo** integration block to a space page.
4. Set visitor input/test values in the GitBook UI.
5. Confirm the webframe displays `visitor.claims` and `visitor.isSet`.
6. Open the browser console and check the `visitor-claims-webframe-demo: received state` log for the raw state object.

If the webframe receives state without visitor context, it shows `No visitor context received.` while still rendering the full state JSON for debugging.

# Configurations

## Schema

Integrations can define a schema for the configuration. The user will be prompted on filling in the configuration to activate the integration.

## Installation & Configuration flow

During the installation flow, an event `installation:setup` is triggered as soon as the first install the integration, you can identify the configuration as being incomplete by checking `environment.installation.status != 'active'`.

This event (`installation:setup`) is triggered every time the user edits one property of the configuration. The status will become `active` once the configuration pass the validation with the schema.

<img src="../.gitbook/assets/install-flow.drawing.svg" alt="" class="gitbook-drawing">

# CLI References

{% hint style="warning" %}
The GitBook Integration Platform is currently in **alpha**. It's not opened to developers just yet.
{% endhint %}

References for the command line utility `gitbook`. The program can be used to create, test and publish integrations for the GitBook.com platform.

Install using `npm install @gitbook/cli -g`.

## `gitbook auth` <a href="#auth"></a>

Authenticate the CLI with a GitBook.com API token. The token can be provided using the command line argument `--token=<token>`; if none is provider, it'll be prompted.

## `gitbook init <dir>` <a href="#init"></a>

Create and initialize a new integration locally. The program will prompt for information about the integration. 

## `gitbook publish <manifest>` <a href="#publish"></a>

Publish the integration defined in the `<manifest>` YAML file.

## `gitbook whoami` <a href="#whoami"></a>

Print information about the currently authenticated user.

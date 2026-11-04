# Reproduction for the global `urlReplacements` option

Shows how Renovate sends its own Maven requests to a public mirror of Maven Central, while registry URLs, lookup results and cache keys keep the original URL.

Pull requests of renovatebot/renovate:

1. [#47690](https://github.com/renovatebot/renovate/pull/47690): the `urlReplacements` option
2. [#47735](https://github.com/renovatebot/renovate/pull/47735): `public` and `fallback` (see [Fallback](#fallback))
3. [#47736](https://github.com/renovatebot/renovate/pull/47736): pass rules to child processes (no reproduction here)

## Config

`urlReplacements` is global-only, so it is in [`config.js`](./config.js), not in `renovate.json`.
It sends Maven Central requests to Google's public mirror:

| `matchUrlPrefix`                        | `replaceUrlPrefix`                                               | `matchHostTypes` |
| --------------------------------------- | ---------------------------------------------------------------- | ---------------- |
| `https://repo.maven.apache.org/maven2/` | `https://maven-central.storage-download.googleapis.com/maven2/` | `maven`          |

`pom.xml` depends on `junit:junit` 4.12 from Maven Central.

## Verify

Check out the PR branch `viceice/feat/url-replacements` of renovatebot/renovate and run `pnpm install`.
Clone this repository, change into it and run:

```sh
RENOVATE_CONFIG_FILE=config.js LOG_LEVEL=debug node <renovate>/lib/renovate.ts
```

`config.js` sets `platform: 'local'` and `dryRun: 'lookup'`, so no token is needed.

Expected:

- `INFO: Using urlReplacements: https://repo.maven.apache.org/maven2/ → https://maven-central.storage-download.googleapis.com/maven2/`
- `DEBUG: urlReplacements: replacing https://repo.maven.apache.org/maven2/junit/junit/maven-metadata.xml with https://maven-central.storage-download.googleapis.com/maven2/junit/junit/maven-metadata.xml`
- `HTTP statistics` lists only `maven-central.storage-download.googleapis.com`.
- `HTTP cache statistics`, the datasource cache and the dependency's `registryUrl` keep `https://repo.maven.apache.org`.
- The update to `junit:junit` 4.13.2 is the same as without the option.

On `main` the option is unknown and all requests go to `repo.maven.apache.org`.

## Fallback

[`config-fallback.js`](./config-fallback.js) points the rule at a mirror which can't be reached (`https://mirror.invalid/maven2/`) and sets `fallback: true`.
Check out the PR branch `viceice/feat/url-replacements-public-fallback` and run:

```sh
RENOVATE_CONFIG_FILE=config-fallback.js LOG_LEVEL=debug node <renovate>/lib/renovate.ts
```

Expected:

- `DEBUG: urlReplacements: replacement for https://repo.maven.apache.org/maven2/junit/junit/maven-metadata.xml failed (…), falling back to the original URL`
- the same update to `junit:junit` 4.13.2
- `HTTP statistics` lists both `mirror.invalid` and `repo.maven.apache.org`

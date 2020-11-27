# eslint-plugin-wemeet

eslint rules for wemeet project

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-wemeet`:

```
$ npm install eslint-plugin-wemeet --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-wemeet` globally.

## Usage

Add `wemeet` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["wemeet"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "wemeet/use-t-function": "warn",
    "wemeet/chinese-spaceing": "warn"
  }
}
```

## Supported Rules

- use-t-function
- chinese-spaceing

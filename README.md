# tslint-strict-error-throw

This rule enhances and replaces the TSLint core rules `no-string-throw` (which equals to ESLint `no-throw-literal`).

It restricts that only instances or subclasses of `Error` be thrown.

**Example – Doing it right**

```ts
throw new Error("message");

class Exception extends Error {
    // ...
}
const exception = new Exception("message");
throw exception;
```

**Example – Anti Pattern**

```ts
throw "error";

throw { message: "error" };

class MyError {
    // ...
}
throw new MyError();
```

> **Note** This rule requires type information to run. [Click](https://palantir.github.io/tslint/usage/type-checking/) to learn more.

## Install

You should already install `tslint`.

```
yarn install --dev tslint-strict-error-throw
```

## Usage

In `tslint.conf` extend the configuration preset provided by this package. It disables `no-string-throw` (from tslint-core) and enables `tslint-strict-error-throw`.

``` json
"extends": [
  ...
  "tslint-strict-error-throw"
]
```

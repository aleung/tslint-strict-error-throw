# tslint-strict-error-throw

TSLint core rules includes `no-string-throw` which equals to ESLint `no-throw-literal`.

However, in `no-throw-literal` document it says:

> **Known Limitations**
> Due to the limits of static analysis, this rule cannot guarantee that you will only throw Error objects.

This rule fills the missing part. It restricts that only instances or subclasses of `Error` be thrown.

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

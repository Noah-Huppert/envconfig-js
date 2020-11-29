# EnvConfig Js
Creates a configuration object from environment variables.

# Table Of Contents
- [Overview](#overview)
- [Development](#development)

# Overview
**Note:** In development, not published to NPM *yet*.  

Allows you to easily retrieve environment variables and organize them in an 
object. Also has some convenient features like ensuring required values are 
present, type casting, default values, prefixing all environment variables.

Demo:

```js
import EnvConfig from "envconfig";

const cfg = EnvConfig("DEMO_APP_", {
  http: {
    port: ["HTTP_PORT", "integer", 8000],
  },
  db: {
    uri: ["DB_URI", "string"],
    name: ["DB_NAME", "string", "dev-database"],
  },
});

console.log(JSON.stringify(cfg, null, 2));
```

Run via:

```
% node demo.js
Missing environment variable(s): DEMO_APP_DB_URI
% export DEMO_APP_DB_URI= 'mongodb://user:password@example.com'
% node demo.js
{
  {
    "http": {
    "port": 8000
  },
  "db": {
    "uri": "mongodb://user:password@example.com",
    "name": "dev-database"
  }
}
```

This makes it very convenient to retrieve configuration from environment 
variables and structure it in your program however you want.

# Development
Written in Typescript.

Install dependencies:

```
% npm install
```

Convert to Js:

```
% npm build
```

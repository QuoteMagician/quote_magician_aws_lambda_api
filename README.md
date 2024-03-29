# quote_magician api

These are the AWL lambda functions that power the quote magician API.

The directory structure is as follows:

```
api
- src
  - {endpoint} e. g. quote
    - index.js
    - (node_modules)
    - ...
  - ...
```

Add dependencies in every directory of one lamba function:

```bash
npm install {the_package}
```

The dependencies will be zipped and uploaded to AWS Lambda. Use `npm install` in the directory of the lambda function to install the dependencies.

Use `npm run package` int the directory of a lambda function to create a zip file that can be uploaded to AWS Lambda.

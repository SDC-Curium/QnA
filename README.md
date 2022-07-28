# QnA
legendary-fiesta

## Setup Linter

Get eslint
```bash
npm install eslint --save-dev
```

Initialize with interactive mode
```bash 
npm create @eslint/config
```

Choose options!
--- 
- To check syntax, find problems, and enforce code style
- CommonJS (require/exports)
- None of these
- No
- Node
- Use a popular style guide
- Airbnb
- Javascript
- Yes
--- 
Done!

## Now, install ESLint extension!

We can have .eslintignore to ignore certain files, like node_modules.
Or we can also use .gitignore to ignore.

```bash
npx eslint --ignore-path .gitignore
```

Now we can do this to fix all fixable linter problems
```bash
npx eslint --ignore-path .gitignore --fix
```

Another way to run this command is add a script to our package.json file.
```
"lint": "npx eslint . --ignore-path .gitignore",
```

## Install Prettier

Prettier can format our code however we want!

```bash
npm install --dev-dependency prettier
```

Prettier's usage is pretty similar to eslint.
To run it on a file, do this:
```bash
npx prettier server.js
```
It will show how it should be foremamted on the terminal. However, I don't want it to output on the terminal. I want it to change my file's formatting.

To write it on a file, run prettier with --write:
```bash
npx prettier --write server.js
```

Another way to run this command is add a script to our package.json file.
```
"format": "prettier --ignore-path .gitignore --write \"**/*.+(js|json)\""
```

\"**/*.+(js|json)\" means apply prettier to files ending with js or json.

## Configure prettier

Prettier is easy to configure using [Prettier Playground](https://prettier.io/playground/)!
After playing around, there is "Copy config JSON" button on the bottom left corner, and put it in .prettierrc.

## Install prettier extension

With the extension, we can format our document on save!
Go to VSCode settings.json and add:
```
"editor.defaultFormatter": "esbenp.pretter-vscode",
"editor.formatOnSave": true,
```

Then, the code will format on save!

## Combine eslint with prettier!

There are errors coming from eslint that will be easily fixed by prettier, such as semicolons, etc.
I don't wanna see those errors without having to save.

So, we install eslint-config-prettier!
```bash
npm install --save-dev eslint-config-prettier
```
After installing, we just put it in the .eslintrc.js file.
```bash
extends: ['airbnb-base', 'eslint-config-prettier'],
```

And, we won't see the error anymore!

## Optional husky setup.

[Husky](https://github.com/typicode/husky) can be used to run script before committing to GitHub. 

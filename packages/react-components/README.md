# React Components

React UI components for DFX.swiss

## Testing package modifications using `npm link`

To test the components in a project, you can use `npm link` to link the local package to the project.

1. To avoid conflicts with the package name, you can change the package name in the `package.json` file, e.g. to 'react-components-local'
2. Build the packages using `npm run build` in the root directory.
3. Link the package using `npm link` in the package directory, i.e. `cd packages/react-components && npm link`.
4. In the project where you want to test the package, link the package using `npm link <package-name>`, i.e. `npm link react-components-local`.
5. Import the component in the project using the package name, e.g. `import { StyledTabContentWrapper } from 'react-components-local'`.
6. To unlink the package, use `npm unlink <package-name>`.

Note that at any time you can view linked packages using `npm ls --global --depth=0 --link=true`.
When you're done, remember to revert the package name in the `package.json` file.

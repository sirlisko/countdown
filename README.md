# Fancy Countdown [![Test Status][test-image]][test-url] [![Build Status][build-image]][build-url]

## Install dependencies

> this project is using [pnpm](https://pnpm.io/) as package manager but it should work with npm as well

```bash
pnpm install
```

## Run it locally

```bash
pnpm start
```

## The stack

- WebApp scaffolded via [Vite](https://vitejs.dev/)
- Typecheck and superset of JS by [Typescript](https://www.typescriptlang.org/)
- Check the syntax and formatting of the JS, via [ESLint](http://eslint.org/) and [Prettier](https://prettier.io/)
- Unit tests with [Vitest](https://vitest.dev/)
- CI using [Github Actions](https://github.com/features/actions)
- Styling [Tailwind CSS](https://tailwindcss.com/)
- UI Components [Shadcn/ui](https://ui.shadcn.com)
- Hosted on [Netlify](https://netlify.com), with Edge Functions rendering link-preview (Open Graph) images

It's possible to [check out the v1 of the project](https://github.com/sirLisko/countdown/tree/v0.1), running Create React App, Jest, Emotion and Babel Macros.

### Example

[Time since Doc and Marty went Back to the Future](https://countdown.sirlisko.com/?f=h%2Cm%2Cs&m=since%20Doc%20and%20Marty%20went%20Back%20to%20the%20Future&t=1985-10-26T09%3A00%3A00.000Z)

[test-image]: https://github.com/sirlisko/countdown/workflows/Test%20CI/badge.svg
[test-url]: https://github.com/sirLisko/countdown/actions
[build-image]: https://api.netlify.com/api/v1/badges/fbe6d19d-38dd-4cac-ba31-a39bc9fa5a07/deploy-status
[build-url]: https://app.netlify.com/sites/fancy-countdown/deploys

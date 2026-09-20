# Project Rules

## TypeScript

- Prefer interfaces over type aliases.
- Use strict mode.

## React

- Functional components only.
- Use hooks.
- Use Tailwind.
- Don't use ternary if-statements in jsx elements expressions. So don't use:
    <>{a > b ? <span>Hello</span> : <span>world</span>}</>
    But use:
    <>
      { a > b && <span>Hello</span>}
      { a <= b && <span>World</span>}
    </>

    Unless it can be done within a single line, no longer than 80 characters, like:
    {sessionSettings.isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}


## Backend

- Django REST Framework.
- JWT authentication.

## General

- DON'T MODIFY CODE BY YOURSELF! Always explain first why you suggest changing code, and then ask for permission first.
- Keep functions under 40 lines.

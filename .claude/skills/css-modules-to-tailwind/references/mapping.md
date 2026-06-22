# CSS → Tailwind v4 utility cheatsheet

Use this to translate declarations. The golden rule: **if the value isn't on
Tailwind's default scale, use an arbitrary value `[…]` to keep it exact.** Do
not round `top: 50px` to `top-12`. Regressions hide in "close enough."

Arbitrary value syntax: `property-[value]` → `w-[68px]`, `top-[var(--x)]`,
`bg-[#1c1c1c]`, `grid-cols-[1fr_2fr]` (spaces become underscores).

## Default scale quick reference

- **Spacing** (`p`, `m`, `gap`, `w`, `h`, `top`…): `1` = `0.25rem` (4px). So
  `0.5rem`→`2`, `1rem`→`4`, `2rem`→`8`, `4rem`→`16`. `px` = `1px`. Anything off
  the 4px grid → arbitrary: `gap-[18px]`.
- **Breakpoints** (min-width by default): `sm` 640, `md` 768, `lg` 1024, `xl`
  1280, `2xl` 1536.
- **font-weight**: `font-normal` 400, `font-medium` 500, `font-semibold` 600,
  `font-bold` 700. Off-scale → `font-[450]`.
- **z-index**: `z-0`, `z-10`…`z-50`, `z-auto`; off-scale → `z-[1000]`.
- **border-radius**: `rounded-sm/md/lg/xl/full`; exact → `rounded-[0.375rem]`.
- **opacity**: `opacity-0`…`opacity-100` in steps; `opacity-[0.85]` otherwise.

## Layout & box model

| CSS                                 | Tailwind                                                |
| ----------------------------------- | ------------------------------------------------------- |
| `display: flex`                     | `flex`                                                  |
| `display: inline-block`             | `inline-block`                                          |
| `display: grid`                     | `grid`                                                  |
| `display: none`                     | `hidden`                                                |
| `flex-direction: column`            | `flex-col`                                              |
| `flex-wrap: wrap`                   | `flex-wrap`                                             |
| `flex-shrink: 0`                    | `shrink-0`                                              |
| `justify-content: space-between`    | `justify-between`                                       |
| `align-items: center`               | `items-center`                                          |
| `align-items: flex-start`           | `items-start`                                           |
| `gap: 2rem`                         | `gap-8` (or `gap-[var(--space-x-2)]` to keep the token) |
| `position: absolute/fixed/relative` | `absolute` / `fixed` / `relative`                       |
| `top/right/bottom/left: 0`          | `inset-0` (all four) or `top-0` etc.                    |
| `overflow: hidden`                  | `overflow-hidden`                                       |
| `box-sizing: border-box`            | `box-border`                                            |
| `width: 100vw` / `100%`             | `w-screen` / `w-full`                                   |
| `max-width: 1024px`                 | `max-w-[1024px]` (or `max-w-screen-lg`)                 |

## Typography

| CSS                       | Tailwind                                           |
| ------------------------- | -------------------------------------------------- |
| `font-size: 0.875rem`     | `text-sm` (matches scale) — else `text-[0.875rem]` |
| `font-size: 400%`         | `text-[400%]`                                      |
| `font-weight: 600`        | `font-semibold`                                    |
| `line-height: 1.4`        | `leading-[1.4]`                                    |
| `line-height: 100%`       | `leading-none`                                     |
| `letter-spacing: -0.2rem` | `tracking-[-0.2rem]`                               |
| `text-align: center`      | `text-center`                                      |
| `text-decoration: none`   | `no-underline`                                     |
| `text-transform: none`    | `normal-case`                                      |
| `color: inherit`          | `text-inherit`                                     |
| `color: var(--x)`         | `text-[var(--x)]`                                  |
| `white-space: nowrap`     | `whitespace-nowrap`                                |

## Color, background, border

| CSS                                       | Tailwind                                                                                |
| ----------------------------------------- | --------------------------------------------------------------------------------------- |
| `color: #555`                             | `text-[#555]`                                                                           |
| `background-color: var(--primary-color)`  | `bg-[var(--primary-color)]`                                                             |
| `background: transparent`                 | `bg-transparent`                                                                        |
| `background-image: linear-gradient(...)`  | `bg-[linear-gradient(...)]` (underscores for spaces) or v4 `bg-linear-to-r from-… to-…` |
| `border: 1px solid var(--x)`              | `border border-[var(--x)]`                                                              |
| `border-top: 5px solid #fff`              | `border-t-[5px] border-t-white`                                                         |
| `border-radius: 50%`                      | `rounded-full`                                                                          |
| `border-radius: 34px`                     | `rounded-[34px]`                                                                        |
| `box-shadow: 0 4px 16px rgb(0 0 0 / 15%)` | `shadow-[0_4px_16px_rgb(0_0_0_/_15%)]`                                                  |

## Transitions, transforms, misc

| CSS                                                       | Tailwind                                                          |
| --------------------------------------------------------- | ----------------------------------------------------------------- |
| `transition: all 0.2s`                                    | `transition-all duration-200`                                     |
| `transition: color 0.2s ease, background-color 0.2s ease` | `transition-[color,background-color] duration-200 ease-out`       |
| `transform: translateX(34px)`                             | `translate-x-[34px]`                                              |
| `transform: rotateX(360deg)`                              | `[transform:rotateX(360deg)]` (no util)                           |
| `transform: translateX(-50%)`                             | `-translate-x-1/2`                                                |
| `cursor: pointer`                                         | `cursor-pointer`                                                  |
| `opacity: 0`                                              | `opacity-0`                                                       |
| `backface-visibility: hidden`                             | `[backface-visibility:hidden]`                                    |
| `content: ''`                                             | `content-['']` (on `before:`/`after:`)                            |
| `list-style: none`                                        | `list-none`                                                       |
| `-webkit-font-smoothing: antialiased`                     | `antialiased`                                                     |
| `width: 0; height: 0`                                     | `w-0 h-0`                                                         |
| `calc(100% - 2rem)`                                       | `w-[calc(100%-2rem)]` (no spaces inside calc, or use underscores) |

## Properties with no clean utility

Use the **arbitrary property** syntax `[property:value]` for anything Tailwind
doesn't model: `[backface-visibility:hidden]`, `[transform:rotateX(360deg)]`,
`[-webkit-background-clip:text]`, `[background-clip:text]`,
`[color-scheme:light_dark]`, `[text-rendering:optimizeLegibility]`.

If a single element accumulates many of these, that's a signal to consider an
`@utility` or `@apply` class instead — see `edge-cases.md`.

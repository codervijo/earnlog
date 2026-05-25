# Framework-specific server code — dropped on port to Astro

The source (`genai/`) was a TanStack Start app with server-rendered
routes + per-request handlers. Astro's static-output model (`output:
'static'`) does not support those at runtime. The following pieces
were dropped on port:

## TanStack Start entry points

- TODO: `genai/src/server.ts` — TanStack Start server handler.
  Static output renders no SSR; no replacement needed unless we move
  to `output: 'server'` later.
- TODO: `genai/src/start.ts` — TanStack Start client entry. Replaced
  by Astro islands (`client:load` directives in `src/pages/*.astro`).
- TODO: `genai/src/router.tsx` — TanStack Router config. Replaced by
  Astro's file-based routing (`src/pages/*.astro`).
- TODO: `genai/src/routeTree.gen.ts` — generated route tree. N/A
  under Astro.
- TODO: `genai/src/routes/__root.tsx` — root layout / error /
  not-found boundaries. Ported partially: layout chrome →
  `src/layouts/Layout.astro`; NotFound → `src/pages/404.astro`. The
  `ErrorComponent` (in-page error recovery via `router.invalidate()`
  + `reset()`) is React-Router-specific and was not ported; client
  errors fall back to the browser default.

## QueryClientProvider

- TODO: `@tanstack/react-query` `QueryClientProvider` wrapper around
  the root was dropped — none of the ported components actually use
  `useQuery` / `useMutation` (data is read from `localStorage` via
  `src/lib/driverstack.ts`). If a feature later needs react-query,
  add the provider inside the React island that needs it.

## Misc

- TODO: `genai/src/lib/error-capture.ts` / `error-page.ts` — not
  ported. These hooked into the TanStack error boundary; revisit if
  we add error reporting.
- TODO: `genai/src/lib/utils.ts` (the `cn()` helper from
  shadcn/ui) — not ported. No ported component uses it. If a future
  shadcn/ui component is ported, copy this file and add `clsx` +
  `tailwind-merge` to `package.json`.
- TODO: `genai/src/components/ui/*` (shadcn/ui components) — not
  ported. None of the ported pages import them; the design uses
  hand-rolled Tailwind primitives.
- TODO: `genai/src/hooks/use-mobile.tsx` — not ported (only used by
  shadcn/ui sidebar component, which we didn't port).

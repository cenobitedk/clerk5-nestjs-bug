# NestJS app with Clerk 5

The repo demonstrates the following bug:

```sh
error TypeError: Failed to parse URL from /protected
    at new Request (node:internal/deps/undici/undici:6110:19)
    at new ClerkRequest (/home/clerk5-nestjs-bug/node_modules/@clerk/backend/src/tokens/clerkRequest.ts:24:5)
    ... 6 lines matching cause stack trace ...
    at canActivateFn (/home/clerk5-nestjs-bug/node_modules/@nestjs/core/router/router-execution-context.js:135:59)
    at /home/clerk5-nestjs-bug/node_modules/@nestjs/core/router/router-execution-context.js:42:37 {
  [cause]: TypeError: Invalid URL
      at new URL (node:internal/url:796:36)
      at new Request (node:internal/deps/undici/undici:6108:25)
      at new ClerkRequest (/home/clerk5-nestjs-bug/node_modules/@clerk/backend/src/tokens/clerkRequest.ts:24:5)
      at createClerkRequest (/home/clerk5-nestjs-bug/node_modules/@clerk/backend/src/tokens/clerkRequest.ts:72:54)
      at authenticateRequest (/home/clerk5-nestjs-bug/node_modules/@clerk/backend/src/tokens/request.ts:66:57)
      at Object.authenticateRequest2 [as authenticateRequest] (/home/clerk5-nestjs-bug/node_modules/@clerk/backend/src/tokens/factory.ts:51:12)
      at AuthService.authenticateRequest (/home/clerk5-nestjs-bug/src/auth/auth.service.ts:26:32)
      at AuthGuard.canActivate (/home/clerk5-nestjs-bug/src/auth/auth.guard.ts:32:52)
      at GuardsConsumer.tryActivate (/home/clerk5-nestjs-bug/node_modules/@nestjs/core/guards/guards-consumer.js:15:34)
      at canActivateFn (/home/clerk5-nestjs-bug/node_modules/@nestjs/core/router/router-execution-context.js:135:59) {
    code: 'ERR_INVALID_URL',
    input: '/protected'
  }
}
```

## Dependencies

- pnpm 9
- NestJS 10
- Clerk 5

## Requirements

Replace `INSERT_CLERK_SECRET` in `src/auth/auth.service.ts` at line 13.

## How to run

Install dependencies, **pnpm** or **npm**, your choice, pnpm is demonstrated here.

```sh
pnpm install
```

Run app

```sh
pnpm start
```

In another terminal

```sh
curl 'http://localhost:3000/public'
// should reply: Hello from public route
```

and this

```sh
curl 'http://localhost:3000/protected'
// should reply: {"message":"Forbidden resource","error":"Forbidden","statusCode":403}
```

The app will throw the TypeError as shown in the intro

```sh
error TypeError: Failed to parse URL from /protected
    at new Request (node:internal/deps/undici/undici:6110:19)
    at new ClerkRequest (/home/clerk5-nestjs-bug/node_modules/@clerk/backend/src/tokens/clerkRequest.ts:24:5)
    ... [truncated]
```

## Other problems

`clerkClient.authenticateRequest()` takes a global `Request` object but won't accept `Request` from express. NestJS is built on top of express by default, so the request objects are always from express. This requires some rather ugly typecasting:

```ts
// import type Request from express
import { Request } from 'express';

// needs type casting
this.clerkClient.authenticateRequest(request as unknown as globalThis.Request);
```

This problem can be proved by activating the import on line 1 in `src/auth/auth.service.ts`.

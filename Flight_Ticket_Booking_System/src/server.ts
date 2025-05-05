// import {
//   AngularNodeAppEngine,
//   createNodeRequestHandler,
//   isMainModule,
//   writeResponseToNodeResponse,
// } from '@angular/ssr/node';
// import express from 'express';
// import { dirname, resolve } from 'node:path';
// import { fileURLToPath } from 'node:url';

// const serverDistFolder = dirname(fileURLToPath(import.meta.url));
// const browserDistFolder = resolve(serverDistFolder, '../browser');

// const app = express();
// const angularApp = new AngularNodeAppEngine();

// /**
//  * Example Express Rest API endpoints can be defined here.
//  * Uncomment and define endpoints as necessary.
//  *
//  * Example:
//  * ```ts
//  * app.get('/api/**', (req, res) => {
//  *   // Handle API request
//  * });
//  * ```
//  */

// /**
//  * Serve static files from /browser
//  */
// app.use(
//   express.static(browserDistFolder, {
//     maxAge: '1y',
//     index: false,
//     redirect: false,
//   }),
// );

// /**
//  * Handle all other requests by rendering the Angular application.
//  */
// app.use('/**', (req, res, next) => {
//   angularApp
//     .handle(req)
//     .then((response) =>
//       response ? writeResponseToNodeResponse(response, res) : next(),
//     )
//     .catch(next);
// });

// /**
//  * Start the server if this module is the main entry point.
//  * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
//  */
// if (isMainModule(import.meta.url)) {
//   const port = process.env['PORT'] || 4000;
//   app.listen(port, () => {
//     console.log(`Node Express server listening on http://localhost:${port}`);
//   });
// }

// /**
//  * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
//  */
// export const reqHandler = createNodeRequestHandler(app);

// import {
//   AngularNodeAppEngine,
//   createNodeRequestHandler,
//   isMainModule,
//   writeResponseToNodeResponse,
// } from "@angular/ssr/node";
// import express from "express";
// import { dirname, resolve, join } from "node:path";
// import { fileURLToPath } from "node:url";

// const serverDistFolder = dirname(fileURLToPath(import.meta.url));
// const browserDistFolder = resolve(serverDistFolder, "../browser");
// const indexHtml = join(browserDistFolder, "index.html");

// const app = express();
// const angularApp = new AngularNodeAppEngine();

// /**
//  * Example Express Rest API endpoints can be defined here.
//  * Uncomment and define endpoints as necessary.
//  *
//  * Example:
//  * ```ts
//  * app.get('/api/**', (req, res) => {
//  *   // Handle API request
//  * });
//  * ```
//  */

// /**
//  * Serve static files from /browser
//  */
// app.use(
//   express.static(browserDistFolder, {
//     maxAge: "1y",
//     index: false,
//     redirect: false,
//   })
// );

// /**
//  * Define routes that should bypass SSR (browser-only routes)
//  * These routes typically use browser-specific APIs and fail during prerendering
//  */
// const browserOnlyRoutes = [
//   "/flight-result",
//   "/booking-details",
//   "/all-bookings-data",
//   "/register",
//   "/oauth-callback",
//   "/complete-profile"
// ];

// app.get(browserOnlyRoutes, (req, res) => {
//   // Send the index.html for browser-only routes
//   res.sendFile(indexHtml);
// });

// /**
//  * Handle all other requests by rendering the Angular application.
//  */
// app.use("/**", (req, res, next) => {
//   angularApp
//     .handle(req)
//     .then((response) =>
//       response ? writeResponseToNodeResponse(response, res) : next()
//     )
//     .catch((err) => {
//       console.error("SSR Error:", err);
//       // Fallback to client-side rendering on SSR errors
//       res.sendFile(indexHtml);
//     });
// });

// /**
//  * Start the server if this module is the main entry point.
//  * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
//  */
// if (isMainModule(import.meta.url)) {
//   const port = process.env["PORT"] || 4000;
//   app.listen(port, () => {
//     console.log(`Node Express server listening on http://localhost:${port}`);
//   });
// }

// /**
//  * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
//  */
// export const reqHandler = createNodeRequestHandler(app);

import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from "@angular/ssr/node";
import express from "express";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, "../browser");
const indexHtml = join(browserDistFolder, "index.html");

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: "1y",
    index: false,
    redirect: false,
  })
);

/**
 * Define routes that should bypass SSR (browser-only routes)
 * These routes typically use browser-specific APIs and fail during prerendering
 */
const browserOnlyRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/admin",
  "/flight",
  "/contact-data",
  "/all-bookings-data",
  "/contact-us",
  "/flight-booking",
  "/flight-result",
  "/booking-details",
  "/oauth-callback",
  "/complete-profile",
];

// Handle browser-only routes
app.get(
  browserOnlyRoutes.map((route) => route + "*"),
  (req, res) => {
    // Send the index.html for browser-only routes
    res.sendFile(indexHtml);
  }
);

// Special handling for complete-profile to ensure it catches all variations
app.get("/complete-profile*", (req, res) => {
  res.sendFile(indexHtml);
});

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use("*", (req, res, next) => {
  // Catch-all route for client-side routing
  if (req.headers.accept?.includes("text/html")) {
    res.sendFile(indexHtml);
    return;
  }

  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next()
    )
    .catch((err) => {
      console.error("SSR Error:", err);
      // Fallback to client-side rendering on SSR errors
      res.sendFile(indexHtml);
    });
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env["PORT"] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);

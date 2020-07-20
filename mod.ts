import { log } from "./depts.ts";
import {Application, send } from "./depts.ts";
import api from "./api.ts";
const app = new Application();
const PORT = 8000;

await log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler("INFO"),
  },
  loggers: {
    default: {
      level: "INFO",
      handlers: ["console"]
    }
  }
});

app.addEventListener("error", (event) => {
  log.error(event.error);
});

// Error handling
app.use(async (ctx, next) => {
  try {
    await next();
  } catch(err) {
    ctx.response.body = "Internal server error";
    throw err;
  }
});

app.use(api.routes());
app.use(api.allowedMethods());

app.use(async (ctx) => {
  const filePath = ctx.request.url.pathname;
  const fileWhitelist = [
    "/index.html",
    "/javascripts/script.js",
    "/stylesheets/style.css",
    "/images/favicon.png",
    "/videos/space.mp4"
  ];
  if (fileWhitelist.includes(filePath)) {
    await send(ctx, filePath, {
      root: `${Deno.cwd()}/public`,
    });
  }
});


if (import.meta.main) {
  log.info(`starting server on port: ${PORT}`);
  await app.listen({
    port: PORT
  });
}

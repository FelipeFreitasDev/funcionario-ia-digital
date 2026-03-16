import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { supportRouter } from "./routers/support";
import { downloadsRouter } from "./routers/downloads";
import { socialAuthRouter } from "./routers/socialAuth";
import { accountsRouter } from "./routers/accounts";
import { ecommerceRouter } from "./routers/ecommerce";
import { creativeRouter } from "./routers/creative";
import { generationsRouter } from "./routers/generations";
import { favoritesRouter } from "./routers/favorites";
import { batchDownloadRouter } from "./routers/batch-download";
import { webhooksRouter } from "./routers/webhooks";
import { analyticsRouter } from "./routers/analytics";
import { schedulerRouter } from "./routers/scheduler";
import { workerRouter } from "./routers/worker";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  support: supportRouter,
  downloads: downloadsRouter,
  socialAuth: socialAuthRouter,
  accounts: accountsRouter,
  ecommerce: ecommerceRouter,
  creative: creativeRouter,
  generations: generationsRouter,
  favorites: favoritesRouter,
  batchDownload: batchDownloadRouter,
  webhooks: webhooksRouter,
  analytics: analyticsRouter,
  scheduler: schedulerRouter,
  worker: workerRouter,

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;

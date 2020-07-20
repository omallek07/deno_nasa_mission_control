import { Router } from "./depts.ts";
import * as planets from "./models/planets.ts";
import * as launches from "./models/launches.ts";

const router = new Router();

router.get("/planets", (ctx) => {
  ctx.response.body = planets.getAllPlanets();
});

router.get("/launches", (ctx) => {
  ctx.response.body = launches.getAllLaunches();
});

router.get("/launches/:id", (ctx) => {
  // ? returns undefined if param does not exist
  if (ctx.params?.id) {
    const launchesList = launches.getOneLaunch(Number(ctx.params.id));
    if (launchesList) {
      ctx.response.body = launchesList;
    } else {
      ctx.throw(400, "Launch with that ID does not exist.");
    }
  }
});

router.delete("/launches/:id", (ctx) => {
  // ? returns undefined if param does not exist
  if (ctx.params?.id) {
    const result = launches.removeOneLaunch(Number(ctx.params.id));
    ctx.response.body = { success: result };
  }
});

router.post("/launches", async (ctx) => {
  const body = await ctx.request.body();
  launches.addOneLaunch(body.value);

  ctx.response.body = { sucess: true };
  ctx.response.status = 201;
});

export default router;

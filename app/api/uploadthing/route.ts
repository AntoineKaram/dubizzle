import { fileRouter } from "@/lib/upload";
import { createRouteHandler } from "uploadthing/next";

export const { GET, POST } = createRouteHandler({
  router: fileRouter,
  config: {},
});

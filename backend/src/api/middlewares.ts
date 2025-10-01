import {
  defineMiddlewares,
  validateAndTransformBody,
} from "@medusajs/framework/http";
import { SearchSchema } from "./store/products/search/route";
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/products/search",
      method: ["POST"],
      middlewares: [validateAndTransformBody(SearchSchema)],
    },
    {
      matcher: "/admin/media",
      method: ["POST"],
      middlewares: [upload.array("file", 1)],
    },
  ],
});

import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { errorHandler } from "./error-handler";
import { ErrorResponse } from "../model/error-response";

export type Method =
  | "GET"
  | "DELETE"
  | "HEAD"
  | "OPTIONS"
  | "POST"
  | "PUT"
  | "PATCH"
  | "PURGE"
  | "LINK"
  | "UNLINK";

type ApiMethodHandlers = {
  [key in Uppercase<Method>]?: NextApiHandler;
};

export function apiHandler(handler: ApiMethodHandlers) {
    return async (req: NextApiRequest, res: NextApiResponse<ErrorResponse>) => {
      try {
        const method = req.method
          ? (req.method.toUpperCase() as keyof ApiMethodHandlers)
          : undefined;

        // check if handler supports current HTTP method
        if (!method)
          return res.status(405).json({
            error: {
              message: `Method ${req.method} Not Allowed on path ${req.url}!`,
            },
            status: 405,
          } as ErrorResponse);

        const methodHandler = handler[method];
        if (!methodHandler)
          return res.status(405).json({
            error: {
              message: `Method ${req.method} Not Allowed on path ${req.url}!`,
            },
            status: 405,
          } as ErrorResponse);

        // call method handler
        await methodHandler(req, res);
      } catch (err) {
        errorHandler(err);
      }
    };
  }
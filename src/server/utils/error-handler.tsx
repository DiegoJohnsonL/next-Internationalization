import { NextApiResponse } from "next";
import { ErrorResponse } from "../model/error-response";
import { ApiError } from "./api-error";
import { NextResponse } from "next/server";

export function errorHandler(err: unknown) {
  if (err instanceof ApiError) {
    const error = err as Error;
    console.error(error.stack);
    return NextResponse.json(
      {
        error: {
          message: error.message,
        },
        status: err.status,
      },
      { status: err.status }
    );
  }

  return NextResponse.json(
    {
      error: {
        message: "Internal Server Error",
        error: err,
      },
      status: 500,
    },
    { status: 500 }
  );
}

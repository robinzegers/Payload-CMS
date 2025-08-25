/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from "@payload-config";
import { GRAPHQL_POST } from "@payloadcms/next/routes";
import { NextRequest } from "next/server";

export const POST = GRAPHQL_POST(config);

export async function OPTIONS(
  request: NextRequest,
  context: { params: Promise<{}> }
) {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

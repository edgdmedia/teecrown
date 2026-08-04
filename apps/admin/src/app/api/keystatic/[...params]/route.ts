import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "../../../../../keystatic.config";

function getHandler() {
  const clientId = process.env.KEYSTATIC_GITHUB_CLIENT_ID;
  const clientSecret = process.env.KEYSTATIC_GITHUB_CLIENT_SECRET;
  const secret = process.env.KEYSTATIC_SECRET;

  if (!clientId || !clientSecret || !secret) {
    return null;
  }

  return makeRouteHandler({
    config,
    clientId,
    clientSecret,
    secret,
  });
}

function missingEnvResponse() {
  return new Response(
    "Missing Keystatic GitHub configuration. Set KEYSTATIC_GITHUB_CLIENT_ID, KEYSTATIC_GITHUB_CLIENT_SECRET, and KEYSTATIC_SECRET.",
    { status: 500 }
  );
}

export async function GET(request: Request) {
  const handler = getHandler();
  if (!handler) return missingEnvResponse();
  return handler.GET(request);
}

export async function POST(request: Request) {
  const handler = getHandler();
  if (!handler) return missingEnvResponse();
  return handler.POST(request);
}

import { runInactivityCheck } from "@/actions/cron";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const authHeader = request.headers.get("authorization");
  const querySecret = url.searchParams.get("secret");
  const allowed = authHeader === `Bearer ${process.env.CRON_SECRET}` || querySecret === process.env.CRON_SECRET;
  if (!allowed) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await runInactivityCheck();
  return Response.json(result);
}

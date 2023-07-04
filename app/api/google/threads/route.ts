// import { z } from "zod";
import { google, Auth } from "googleapis";
import he from 'he';
import { NextResponse } from "next/server";
import { client } from "../client";

// const threadsQuery = z.object({ slug: z.string() });
// export type ThreadsQuery = z.infer<typeof threadsQuery>;
export type ThreadsResponse = Awaited<ReturnType<typeof getThreads>>;

async function getThreads(auth: Auth.OAuth2Client) {
  const gmail = google.gmail({ version: "v1", auth });
  const res = await gmail.users.threads.list({ userId: "me", labelIds: ["INBOX"], maxResults: 3 });
  const threads = res.data.threads?.map(t => {
    return {
      ...t,
      snippet: he.decode(t.snippet || "")
    }
  });

  return { threads };
}

export async function GET() {
  const threads = await getThreads(client);

  return NextResponse.json(threads);
}
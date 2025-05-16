import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const path = req.nextUrl.searchParams.get("path");

  if (!path) {
    return new Response("Path is required", { status: 400 });
  }

  const { data, error } = await supabase.storage.from("avatars").download(path);

  if (error || !data) {
    return new Response("Error fetching image", { status: 500 });
  }

  return new NextResponse(data, {
    headers: {
      "Content-Type": data.type,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

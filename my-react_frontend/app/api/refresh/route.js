import { NextRequest, NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  console.log("HI:   " + body.refresh);
  const response = await fetch("http://127.0.0.1:8000/api/refresh-token/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body,
  });
  console.log(await response.json());
  return NextResponse.json({
    hi: "HI",
  });
}

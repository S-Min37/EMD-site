import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

import { getSanityTagsForType } from "@/sanity/lib/tags";

type WebhookPayload = {
  _type?: string;
};

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.SANITY_REVALIDATE_SECRET;
    if (!secret) {
      return new Response("Missing environment variable SANITY_REVALIDATE_SECRET", {
        status: 500,
      });
    }

    const { isValidSignature, body } = await parseBody<WebhookPayload>(req, secret);

    if (!isValidSignature) {
      return NextResponse.json(
        {
          message: "Invalid signature",
          isValidSignature,
        },
        { status: 401 }
      );
    }

    if (!body?._type) {
      return NextResponse.json(
        {
          message: "Missing _type in webhook payload",
          body,
        },
        { status: 400 }
      );
    }

    const tags = getSanityTagsForType(body._type);
    for (const tag of tags) {
      revalidateTag(tag);
    }

    return NextResponse.json({
      revalidated: true,
      type: body._type,
      tags,
    });
  } catch (error) {
    console.error(error);
    return new Response(
      error instanceof Error ? error.message : "Unknown revalidation error",
      { status: 500 }
    );
  }
}

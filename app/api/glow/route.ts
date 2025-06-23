import { NextResponse } from "next/server";
import * as vision from "@google-cloud/vision";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file") as File;
  const buffer = Buffer.from(await file.arrayBuffer());
  const tempPath = path.join("/tmp", file.name);
  await writeFile(tempPath, buffer);

  const client = new vision.ImageAnnotatorClient();
  const [result] = await client.labelDetection(tempPath);
  const labels = result.labelAnnotations?.map(l => l.description).join(", ");
  return NextResponse.json({ result: labels });
}

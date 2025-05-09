import { v2 as cloudinary } from "cloudinary";
import { extractPublicIdsFromMarkdown } from "@util/extractPublicIds";

if (!process.env.CLOUDINARY_CLOUD_NAME) {
  throw new Error("CLOUDINARY_CLOUD_NAME is not set");
}

if (!process.env.CLOUDINARY_API_KEY) {
  throw new Error("CLOUDINARY_API_KEY is not set");
}

if (!process.env.CLOUDINARY_API_SECRET) {
  throw new Error("CLOUDINARY_API_SECRET is not set");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(image) {
  const imageData = await image.arrayBuffer();
  const mime = image.type;
  const encoding = "base64";
  const base64Data = Buffer.from(imageData).toString("base64");
  const fileUri = "data:" + mime + ";" + encoding + "," + base64Data;
  const result = await cloudinary.uploader.upload(fileUri, {
    folder: "blogProjectWithNext",
    quality: "auto", // 자동 압축
    fetch_format: "auto", // WebP 등으로 자동 변환
  });
  return result.secure_url;
}

export async function deletePostAssets(post) {
  const publicIdsFromContent = extractPublicIdsFromMarkdown(post.CONTENT);
  const thumbnailPublicId = post.IMAGE_URL
    ? post.IMAGE_URL.match(
        /\/upload\/(?:v\d+\/)?(.+?)\.(jpg|jpeg|png|gif|webp)/
      )?.[1]
    : null;

  const allPublicIds = [...publicIdsFromContent];
  if (thumbnailPublicId) allPublicIds.push(thumbnailPublicId);

  for (const id of allPublicIds) {
    try {
      await cloudinary.uploader.destroy(id);
      console.log(`🗑️ Cloudinary 이미지 삭제 완료: ${id}`);
    } catch (err) {
      console.error(`❌ 이미지 삭제 실패: ${id}`, err);
    }
  }
}

export async function deleteUnusedImages(content, uploadedIds) {
  const used = extractPublicIdsFromMarkdown(content);
  const unused = uploadedIds.filter((id) => !used.includes(id));

  for (const id of unused) {
    try {
      await cloudinary.uploader.destroy(id);
      console.log("🗑️ 미사용 이미지 삭제 완료:", id);
    } catch (err) {
      console.error("❌ 삭제 실패:", id, err);
    }
  }
}

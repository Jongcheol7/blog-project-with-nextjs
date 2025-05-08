export function extractPublicIdsFromMarkdown(content) {
  const regex =
    /https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/(?:v\d+\/)?([^)"\s]+)/g;
  const publicIds = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    const fullPath = match[1];
    const publicId = fullPath.replace(/\.(jpg|png|jpeg|gif|webp)$/, "");
    publicIds.push(publicId);
  }
  return publicIds;
}

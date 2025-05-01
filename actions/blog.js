"use server";

export default async function createPost(prevState, formData) {
  const title = formData.get("title");
  const content = formData.get("content");
  const image = formData.get("image");

  let errors = [];
  if (!title || title.trim().length === 0) {
    errors.push("Title is required.");
  }
  if (!content || content.trim().length === 0) {
    errors.push("Content is required.");
  }
  if (!image || image.size === 0) {
    errors.push("Image is required.");
  }
  if (errors.length > 0) {
    return {
      success: false,
      errors: errors,
    };
  }

  return {
    success: true,
    errors: [],
  };
}

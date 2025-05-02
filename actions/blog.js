"use server";

import { revalidatePath } from "next/cache";
import { uploadImage } from "../cloudinary";
import { insertBlog, insertTags } from "../lib/blog-db";
import { redirect } from "next/navigation";

export default async function createPost(prevState, formData) {
  const title = formData.get("title");
  const content = formData.get("content");
  const image = formData.get("image");
  const tags = formData.get("tags");

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

  let imageUrl;
  try {
    console.log("업로드할 이미지: ", image);
    imageUrl = await uploadImage(image);
  } catch (error) {
    throw new Error(
      "Image upload failed, post was not created. Please try again later."
    );
  }

  const insertResult = await insertBlog({
    title,
    content,
    imageUrl: imageUrl,
    userId: "jclee",
  });

  const postNo = insertResult.lastInsertRowid;
  const tagNames = [];
  if (tags) {
    tagNames = tags
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag.length > 0);
  }
  if (tagNames && tagNames.length > 0) {
    await insertTags(tagNames, postNo);
  }

  revalidatePath("/", "layout");
  redirect("/blog");

  return {
    success: true,
    errors: [],
  };
}

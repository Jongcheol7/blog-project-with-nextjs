"use server";

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> f4e32cc (글 저장 기능 추가, 태그 기능 개발중)
import { revalidatePath } from "next/cache";
import { uploadImage } from "../cloudinary";
import { insertBlog, insertTags } from "../lib/blog-db";
import { redirect } from "next/navigation";

<<<<<<< HEAD
=======
>>>>>>> 9f8ce59 (블로그 개발 시작)
=======
>>>>>>> f4e32cc (글 저장 기능 추가, 태그 기능 개발중)
export default async function createPost(prevState, formData) {
  const title = formData.get("title");
  const content = formData.get("content");
  const image = formData.get("image");
<<<<<<< HEAD
<<<<<<< HEAD
  const tags = formData.get("tags");
=======
>>>>>>> 9f8ce59 (블로그 개발 시작)
=======
  const tags = formData.get("tags");
>>>>>>> f4e32cc (글 저장 기능 추가, 태그 기능 개발중)

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

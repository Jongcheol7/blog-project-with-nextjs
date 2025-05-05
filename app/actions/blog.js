"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteUnusedImages, uploadImage } from "../../cloudinary";
import {
  deleteBlogTags,
  deleteTags,
  insertBlog,
  insertTags,
  updateBlog,
} from "../../lib/blog-db";
import { NextResponse } from "next/server";

export default async function createPost(prevState, formData) {
  const title = formData.get("title");
  const content = formData.get("content");
  const image = formData.get("image");
  const tags = formData.get("tags");
  const categoryId = formData.get("category");
  const uploadedIdsRaw = formData.get("uploadedIds");
  const uploadedIds = uploadedIdsRaw ? uploadedIdsRaw.split(",") : [];

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
    categoryId,
  });

  const postNo = insertResult.lastInsertRowid;
  /*
  const tagNames = tags
    ? tags
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter((tag) => tag.length > 0)
    : [];
  */
  const tagNames = [
    ...new Set(
      tags
        ? tags
            .split(",")
            .map((tag) => tag.trim().toLowerCase())
            .filter((tag) => tag.length > 0)
        : []
    ),
  ];

  if (tagNames.length > 0) {
    await insertTags(tagNames, postNo);
  }

  try {
    await deleteUnusedImages(content, uploadedIds);
  } catch (err) {
    console.log("미사용 이미지 삭제중 오류 : ", err);
    return NextResponse.json({ error: "블로그 조회 오류" }, { status: 500 });
  }

  revalidatePath("/blog");
  redirect("/blog");

  return { success: true };
}

export async function updatePost(prevState, formData) {
  const postNo = formData.get("postNo");
  const title = formData.get("title");
  const content = formData.get("content");
  const image = formData.get("image");
  const tags = formData.get("tags");
  const categoryId = formData.get("category");
  const uploadedIdsRaw = formData.get("uploadedIds");
  const uploadedIds = uploadedIdsRaw ? uploadedIdsRaw.split(",") : [];

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

  console.log("📦 image:", image);
  console.log("📦 image type:", typeof image);

  let imageUrl;
  try {
    imageUrl = await uploadImage(image);
  } catch (error) {
    throw new Error(
      "Image upload failed, post was not created. Please try again later."
    );
  }

  await updateBlog({
    postNo,
    title,
    content,
    imageUrl: imageUrl,
    userId: "jclee",
    categoryId,
  });

  const tagNames = [
    ...new Set(
      tags
        ? tags
            .split(",")
            .map((tag) => tag.trim().toLowerCase())
            .filter((tag) => tag.length > 0)
        : []
    ),
  ];

  if (tagNames.length > 0) {
    try {
      await deleteBlogTags(postNo);
      await deleteTags(postNo);
      await insertTags(tagNames, postNo);
    } catch (err) {
      console.log("태그 삭제 오류 : ", err);
      return NextResponse.json({ error: "태그 삭제 오류" }, { status: 500 });
    }
  }

  try {
    await deleteUnusedImages(content, uploadedIds);
  } catch (err) {
    console.log("미사용 이미지 삭제중 오류 : ", err);
    return NextResponse.json({ error: "블로그 조회 오류" }, { status: 500 });
  }

  revalidatePath("/blog");
  redirect("/blog");

  return { success: true };
}

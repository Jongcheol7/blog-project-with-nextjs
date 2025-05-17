"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteUnusedImages, uploadImage } from "@lib/cloudinary";
import {
  deleteBlogTags,
  deleteTags,
  insertBlog,
  insertComment,
  insertTags,
  updateBlog,
} from "@lib/blog-db";
import { NextResponse } from "next/server";
import { extractPublicIdsFromMarkdown } from "@util/extractPublicIds";

export default async function createPost(prevState, formData) {
  const privateYn = formData.get("privateYn");
  const title = formData.get("title");
  const userId = formData.get("userId");
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
  if (!categoryId) {
    errors.push("Category is required.");
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
    userId: userId,
    categoryId,
    privateYn: privateYn === "on" ? "Y" : "N",
  });

  const postNo = insertResult.lastInsertRowid;

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
  const userId = formData.get("userId");
  const title = formData.get("title");
  const content = formData.get("content");
  const privateYn = formData.get("privateYn");
  const image = formData.get("image");
  const tags = formData.get("tags");
  const categoryId = formData.get("category");
  const uploadedIdsRaw = formData.get("uploadedIds");
  const uploadedIds = uploadedIdsRaw ? uploadedIdsRaw.split(",") : [];
  const existingthumbnailUrl = formData.get("existingthumbnailUrl");

  let errors = [];
  if (!title || title.trim().length === 0) {
    errors.push("Title is required.");
  }
  if (!userId || userId.trim().length === 0) {
    errors.push("UserId is required.");
  }
  if (!content || content.trim().length === 0) {
    errors.push("Content is required.");
  }
  if ((!image && image.size === 0) || !existingthumbnailUrl) {
    errors.push("Image is required.");
  }
  if (!categoryId) {
    errors.push("Category is required.");
  }
  if (errors.length > 0) {
    return {
      success: false,
      errors: errors,
    };
  }

  console.log("image : ", image);
  console.log("existingthumbnailUrl : ", existingthumbnailUrl);

  let imageUrl;
  try {
    if (image && image.size > 0 && image.name !== "undefined") {
      //기존것 삭제해야함
      await deleteUnusedImages(
        "",
        extractPublicIdsFromMarkdown(existingthumbnailUrl)
      );
      imageUrl = await uploadImage(image);
    } else {
      console.log("새로추가안함 기존사진그대로사용");
      imageUrl = existingthumbnailUrl;
    }
  } catch (error) {
    throw new Error(
      "Image upload failed, post was not created. Please try again later."
    );
  }
  console.log("수정데이터-------------");
  console.log("postNo : ", postNo);
  console.log("title : ", title);
  console.log("content : ", content);
  console.log("imageUrl : ", imageUrl);
  console.log("categoryId : ", categoryId);
  console.log("privateYn : ", privateYn);
  console.log("------------------------");
  await updateBlog({
    postNo,
    title,
    content,
    imageUrl: imageUrl,
    userId,
    categoryId,
    privateYn: privateYn === "on" ? "Y" : "N",
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

"use client";
import Image from "next/image";
import { useState } from "react";

export default function ImagePicker() {
  const [pickedImage, setPickedImage] = useState();
  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) {
      setPickedImage(null);
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPickedImage(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }
  return (
    <div className="flex gap-2">
      <div>
        {!pickedImage && (
          <div className="font-light text-center w-30 border border-gray-300 py-2 text-sm">
            <p>No image</p>
            <p>picked yet.</p>
          </div>
        )}
        {pickedImage && (
          <Image
            src={pickedImage}
            alt="Selected Image"
            width={150}
            height={120}
            className="border object-cover"
          />
        )}
      </div>
      <input
        type="file"
        name="image"
        id="image"
        accept="image/png, image/jpeg"
        onChange={handleImageChange}
        className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
      />
    </div>
  );
}

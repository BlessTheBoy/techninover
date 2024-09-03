"use client";

import { useState, useRef } from "react";
import { Upload } from "lucide-react";
import UploadIcon from "./svgs/upload-icon";
import Image from "next/image";
import Trash from "./svgs/trash";

export default function ImageUploader({
  image,
  setImage,
  label,
  optional,
}: {
  image: string | undefined;
  setImage: (image: string | undefined) => void;
  label?: string;
  optional?: boolean;
}) {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | undefined>(undefined);
  const [fileSize, setFileSize] = useState<number | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files[0]);
    }
  };

  const handleFiles = (file: File) => {
    if (file.type === "image/png" || file.type === "image/jpeg") {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setFileName(file.name);
      setFileSize(file.size);
    } else {
      alert("Please upload only PNG or JPG files.");
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <div className="grid items-center gap-1.5">
      {label ? (
        <label className="font-inter font-medium text-sm text-text_header">
          {label}{" "}
          {optional ? <span className="font-normal">(Optional)</span> : null}
        </label>
      ) : null}

      <div
        className={`relative p-4 rounded-xl border ${
          dragActive ? "border-purple bg-purple_bg" : "border-gray_8"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".jpg,.jpeg,.png"
          onChange={handleChange}
          name="cover"
        />
        {image ? (
          <div className="flex items-center gap-3">
            <div className="w-[50%] h-[87px] relative">
              <Image
                src={image}
                alt="uploaded"
                className="w-auto h-[87px] rounded object-contain"
                fill
              />
            </div>
            <div className="flex gap-1 flex-1">
              <div className="flex-1">
                <p className="font-inter font-medium text-sm text-[#344054] text-ellipsis line-clamp-2">
                  {fileName ?? "Cover image"}
                </p>
                {fileSize ? (
                  <p className="font-inter font-normal text-sm text-gray_9">
                    {formatFileSize(fileSize)}
                  </p>
                ) : null}
              </div>
              <button
                onClick={() => {
                  setImage(undefined);
                  setFileName(undefined);
                  setFileSize(undefined);
                  inputRef.current!.value = "";
                }}
                className="group flex items-center justify-center h-6 w-6 rounded hover:bg-error_bg self-center border border-gray_6"
              >
                <Trash className="group-hover:fill-error group-hover:stroke-error" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center gap-3">
            <UploadIcon />
            <div className="space-y-1">
              <p className="font-inter font-normal text-sm text-gray_9 text-center">
                <span
                  onClick={onButtonClick}
                  className="font-medium text-purple inline-block cursor-pointer hover:bg-purple_bg select-none"
                >
                  Click to upload
                </span>{" "}
                or drag and drop
              </p>
              <p className="font-inter font-normal text-xs text-gray_9 text-center">
                PNG or JPG
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

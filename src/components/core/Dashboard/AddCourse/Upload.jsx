import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud } from "react-icons/fi";
import { useSelector } from "react-redux";

import "video-react/dist/video-react.css";
import { Player } from "video-react";

export default function Upload({
  name,
  label,
  register,
  setValue,
  errors,
  video = false,
  viewData = null,
  editData = null,
}) {
  const { course } = useSelector((state) => state.course);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSource, setPreviewSource] = useState(
    viewData || editData || ""
  );

  // Handle file drop / select
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];

    if (file) {
      setSelectedFile(file);
      previewFile(file);
    }
  };

  // Dropzone config
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    accept: video
      ? {
          "video/mp4": [".mp4"],
          "video/webm": [".webm"],
          "video/quicktime": [".mov"],
        }
      : {
          "image/jpeg": [".jpg", ".jpeg"],
          "image/png": [".png"],
        },
    onDrop,
  });

  // Preview file
  const previewFile = (file) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  // Register input with react-hook-form
  useEffect(() => {
    register(name, { required: true });
  }, [register, name]);

  // Set selected file in form state
  useEffect(() => {
    setValue(name, selectedFile);
  }, [selectedFile, setValue, name]);

  // Cancel file
  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewSource("");
    setValue(name, null);
  };

  return (
    <div className="flex flex-col space-y-2">
      {/* Label */}
      <label htmlFor={name} className="text-sm text-richblack-5">
        {label} {!viewData && <sup className="text-pink-200">*</sup>}
      </label>

      {/* Upload Box */}
      <div
        className={`${
          isDragActive ? "bg-richblack-600" : "bg-richblack-700"
        } relative flex min-h-[250px] cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-richblack-500`}
      >
        {previewSource ? (
          <div className="flex w-full flex-col p-6">
            {!video ? (
              <img
                src={previewSource}
                alt="Preview"
                className="h-full w-full rounded-md object-cover"
              />
            ) : (
              <Player
                aspectRatio="16:9"
                playsInline
                src={previewSource}
              />
            )}

            {!viewData && (
              <button
                type="button"
                onClick={handleCancel}
                className="mt-3 text-sm text-richblack-300 underline hover:text-yellow-50"
              >
                Cancel
              </button>
            )}
          </div>
        ) : (
          <div
            {...getRootProps()}
            className="flex w-full flex-col items-center p-6"
          >
            <input {...getInputProps()} />

            <div className="grid aspect-square w-14 place-items-center rounded-full bg-pure-greys-800">
              <FiUploadCloud className="text-2xl text-yellow-50" />
            </div>

            <p className="mt-2 max-w-[250px] text-center text-sm text-richblack-200">
              Drag and drop an {!video ? "image" : "video"}, or click to{" "}
              <span className="font-semibold text-yellow-50">Browse</span>
            </p>

            <ul className="mt-8 flex list-disc justify-between space-x-10 text-xs text-richblack-200">
              <li>Aspect ratio 16:9</li>
              <li>{video ? "MP4 / MOV / WEBM" : "JPG / PNG"}</li>
            </ul>
          </div>
        )}
      </div>

      {/* Error */}
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  );
}
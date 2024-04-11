"use client";

import { Flex, Grid, Text } from "@radix-ui/themes";

import { useRef, useState } from "react";

export type DropzoneProps = {
  heading?: string;
  id: string;
  name: string;
} & React.HTMLProps<HTMLDivElement>;
export default function Dropzone({ heading = "파일을 업로드 해주세요.", id, name }: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const files = event.dataTransfer.files;
    const file = files[0];

    if (
      file &&
      file.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      alert("Not implemented");
      throw new Error("Not implemented");

      // Upload the file to the server
      const formData = new FormData();
      formData.append("file", file);

      // Make a POST request to the server with the formData
      fetch("/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          // Handle the response from the server
          // TODO: when uploaded, show a toast message
          console.log(response);
        })
        .catch((error) => {
          // Handle any errors
          console.error(error);
        });
    } else {
      console.log("Invalid file format. Please upload an xlsx file.");
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Grid
      className="dropzone my-2 h-[100px] place-items-center border-2 border-dashed border-violet3 bg-violet1 rounded-[12px] cursor-pointer transition-all ease-linear duration-75"
      style={{
        border: isDragging
          ? "2px dashed var(--accent-a8)"
          : "1px dashed var(--accent-a6)",
        backgroundColor: "var(--accent-a1)",
        borderRadius: "var(--radius-3)",
      }}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <Flex direction="column" align="center">
        {heading && (
          <Text weight="bold" size="2">
            {heading}
          </Text>
        )}
        <Text color="gray" size={heading ? "2" : undefined}>
          {isDragging
            ? "Drop the (xlsx, csv) file here"
            : "Drag and drop an (xlsx, csv) file here"}
        </Text>
      </Flex>
      <input
        id={id}
        name={name}
        type="file"
        style={{ display: "none" }}
        ref={fileInputRef}
        accept=".xlsx"
      />
    </Grid>
  );
}

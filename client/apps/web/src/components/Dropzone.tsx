"use client";

import { Cross1Icon } from "@radix-ui/react-icons";
import { Box, Flex, Grid, Text } from "@radix-ui/themes";

import { useRef, useState } from "react";

export type DropzoneProps = {
  heading?: string;
  id: string;
  name: string;
  multiple?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;
export default function Dropzone({ heading = "파일을 업로드 해주세요.", id, name, multiple = false, className }: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
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
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(event.target.files);
    }
  }

  return (
    <Grid
      className={`dropzone my-2 h-[100px] place-items-center border-2 border-dashed border-violet3 bg-violet1 rounded-[12px] cursor-pointer transition-all ease-linear duration-75`}
      style={{
        border: isDragging
          ? "2px dashed var(--accent-a8)"
          : (!!files ? "1px solid var(--accent-a6)"
            : "1px dashed var(--accent-a6)"),
        backgroundColor: !!files ? "var(--accent-a6)" : "var(--gray-a1)",
        borderRadius: "var(--radius-3)",
      }}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <Flex direction="column" align="center">
        {
          !files ? (
            <>
              <Text weight="bold" size="2">
                {heading}
              </Text>
              <Text color="gray" size={heading ? "2" : undefined}>
                {isDragging
                  ? "Drop the (xlsx, csv) file here"
                  : "Drag and drop an (xlsx, csv) file here"}
              </Text>
            </>
          )
            :
            <Flex gap="2">
              {Array.from(files).map((file, index) => (
                <Box key={index} className="rounded border p-2 bg-primary-700 text-white">
                  {file.name}
                </Box>
              ))}</Flex>

        }
      </Flex>
      <input
        id={id}
        name={name}
        type="file"
        style={{ display: "none" }}
        ref={fileInputRef}
        accept=".xlsx"
        multiple={multiple}
        onChange={handleChange}
      />
    </Grid>
  );
}

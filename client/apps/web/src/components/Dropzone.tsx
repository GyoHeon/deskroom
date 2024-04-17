"use client";

import { Flex, Grid, Text } from "@radix-ui/themes";

import { useEffect, useRef, useState } from "react";
import Spinner from "./Spinner";
import { useOrganizationContext } from "@/contexts/OrganizationContext";
import { PartialKnowledgeImage } from "@/lib/supabase.types";

export type DropzoneProps = {
  heading?: string;
  id: string;
  name: string;
  multiple?: boolean;
  accept?: string
  questionId?: number;
  existingFiles?: PartialKnowledgeImage[];
} & React.HTMLAttributes<HTMLDivElement>;

type UploadStatus = 'CREATED' | 'PENDING' | 'DONE' | 'FAILED';
const DropzoneFileSpinner = ({ status }: { status?: UploadStatus }) => {
  if (!status) return null;
  switch (status) {
    case 'CREATED':
      return <Spinner size={4} />
    case 'PENDING':
      return <Spinner size={4} shouldSpin />
    case 'DONE':
      return <Spinner size={4} done />
    case 'FAILED':
      return <Spinner size={4} failed />
  }
}

async function fileUploadByClient(file: File, orgKey: string, questionId: number) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/v1/images/upload?org_key=${orgKey}&question_id=${questionId}`, { // TODO: add server endpoint
    method: "POST",
    body: formData,
  });
  const responseData = await response.json();
  if (!response.ok) {
    return { error: responseData.error };
  }
  return {
    error: null,
    status: responseData.status,
    filename: responseData.filename,
    fileUrl: responseData.fileUrl,
  }
}

const DropzoneContent = ({ heading, isDragging, files, accept, existingFiles, fileStatus }: { heading: string, isDragging: boolean, files: FileList | null, accept: string, existingFiles: PartialKnowledgeImage[], fileStatus: { file: File, status: 'CREATED' | 'PENDING' | 'DONE' | 'FAILED' }[] }) => {
  if (existingFiles && existingFiles.length > 0) {
    return <>
      <Flex gap="2">
        {existingFiles.map((file, index) => (
          <Flex key={index} className="rounded border p-2 bg-primary-700 text-white items-center justify-center gap-2">
            <Text className="text-xs">{file.file_name}</Text>
          </Flex>
        ))}</Flex>

    </>
  }
  return (
    <>
      {
        !files ? (
          <>
            <Text weight="bold" size="2">
              {heading}
            </Text>
            <Text color="gray" size={heading ? "2" : undefined}>
              {isDragging
                ? `Drop the (${accept.split(',').join(', ')}) file here`
                : `Drag and drop an (${accept.split(',').join(', ')}) file here`}
            </Text>
          </>
        )
          :
          <Flex gap="2">
            {Array.from(files).map((file, index) => (
              <Flex key={index} className="rounded border p-2 bg-primary-700 text-white items-center justify-center gap-2">
                <DropzoneFileSpinner status={fileStatus[index]?.status} />
                <Text className="text-xs">{file.name}</Text>
              </Flex>
            ))}</Flex>

      }
    </>
  )
}

export default function Dropzone({ heading = "파일을 업로드 해주세요.", id, name, multiple = false, className, accept = '.xlsx', questionId, existingFiles }: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [filesStatus, setFilesStatus] = useState<{ file: File, status: 'CREATED' | 'PENDING' | 'DONE' | 'FAILED' }[]>([]);
  const { currentOrg } = useOrganizationContext();

  useEffect(() => {
    const startUploadFiles = async () => {
      if (!!files) {
        const filesArray = Array.from(files);
        for (const file of filesArray) {
          const { error, status } = await fileUploadByClient(file, currentOrg?.key, questionId);
          if (error) {
            setFilesStatus((prev) => [...prev, { file, status: 'FAILED' }]);
          }
          setFilesStatus((prev) => [...prev, { file, status }]);
        }
      }
    }
    startUploadFiles();
  }, [files]);


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
      <Flex direction="column" align="center" className="flex-wrap">
        <DropzoneContent heading={heading} isDragging={isDragging} files={files} accept={accept} existingFiles={existingFiles} fileStatus={filesStatus} />
      </Flex>
      <input
        id={id}
        name={name}
        type="file"
        style={{ display: "none" }}
        ref={fileInputRef}
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        disabled={existingFiles?.length > 0}
      />
    </Grid>
  );
}

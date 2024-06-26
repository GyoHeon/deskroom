"use server";

import { createClient } from "@/utils/supabase/server";
import { UploadStatus } from "./UploadForm";

export const fileUpload = async (
  file: File,
  orgKey: string
): Promise<{
  error?: string | null;
  message?: string | null;
  files?: string[];
  org_key?: string;
}> => {
  const formData = new FormData();
  formData.append("files", file, file.name);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/sources/upload?org_key=${orgKey}`,
    {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    const data = await response.json();
    return {
      error: "Upload failed",
      message: data?.detail || "Upload failed",
    };
  }

  return (await response.json()) as { files: string[]; org_key: string };
};

export default async function upload(
  prevState: UploadStatus,
  formData: FormData
): Promise<UploadStatus> {
  const userID = formData.get("user-id") as string;
  const orgKey = formData.get("org-key") as string;
  const channelTalkFiles = formData.getAll("channel-talk-files") as File[];
  const miscFiles = formData.getAll("misc-files") as File[];
  if (channelTalkFiles[0].size === 0 && miscFiles[0].size === 0) {
    return {
      errors: {
        channelTalkFiles: "업로드할 파일이 없습니다.",
        miscFiles: "업로드할 파일이 없습니다.",
      },
      status: 400,
      message: "Upload failed",
    };
  }

  const channelTalkUpload = await Promise.all(
    channelTalkFiles.map(async (file: File) => {
      return await fileUpload(file, orgKey);
    })
  );

  if (channelTalkUpload.some((upload) => upload.error)) {
    return {
      errors: {
        channelTalkFiles: channelTalkUpload
          .map((upload) => upload.message)
          .join(", "),
      },
      status: 400,
      message: "Upload failed",
    };
  }

  const miscUpload = await Promise.all(
    miscFiles.map(async (file: File) => {
      return await fileUpload(file, orgKey);
    })
  );

  if (miscUpload.some((upload) => upload.error)) {
    return {
      errors: {
        miscFiles: miscUpload.map((upload) => upload.message).join(", "),
      },
      status: 400,
      message: "Upload failed",
    };
  }

  // TODO: handle other files
  const uploadResponse = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/knowledge/upload/${orgKey}`,
    {
      method: "POST",
      body: JSON.stringify({
        user_id: userID,
        file_urls: channelTalkUpload.map((upload) => upload.files).flat(),
        type: "CHANNELTALK",
      }),
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    }
  );

  if (!uploadResponse.ok) {
    const data = await uploadResponse.json();
    return {
      errors: {
        channelTalkFiles: data?.detail || "Upload failed",
        miscFiles: data?.detail || "Upload failed",
      },
      status: 400,
      message: "Upload failed",
    };
  }

  return {
    errors: null,
    status: 200,
    message: "Upload successful",
  };
}

export async function getUploadJobs(
  orgKey: string,
  status: "PENDING" | "SUCCESS" = "PENDING",
  returnCount: boolean = false
): Promise<{ error?: string | null; data?: any }> {
  const supabase = createClient();
  const {
    data: uploadData,
    error: uploadError,
    count: uploadCount,
  } = await supabase
    .from("uploads")
    .select("*", { count: "exact" })
    .eq("org_key", orgKey)
    .eq("status", status);

  if (uploadError) {
    return;
  }

  if (returnCount) {
    return { data: uploadCount };
  }

  return {
    data: uploadData,
  };
}

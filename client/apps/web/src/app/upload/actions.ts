'use server';
import { UploadStatus } from "./UploadForm";

const fileUpload = async (file: File, orgKey: string): Promise<{ error: string | null, message: string | null }> => {
  const formData = new FormData();
  formData.append('files', file, file.name);

  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/v1/sources/upload?org_key=${orgKey}`, {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json',
    },
  })

  if (!response.ok) {
    const data = await response.json()
    return {
      error: 'Upload failed',
      message: data?.detail || 'Upload failed',
    }
  }

  return await response.json();
}


export default async function upload(prevState: UploadStatus, formData: FormData): Promise<UploadStatus> {
  const orgKey = formData.get('org-key') as string;
  const channelTalkFiles = formData.getAll('channel-talk-files') as File[];
  const miscFiles = formData.getAll('misc-files') as File[];
  if (channelTalkFiles[0].size === 0 && miscFiles[0].size === 0) {
    return {
      errors: {
        channelTalkFiles: '업로드할 파일이 없습니다.',
        miscFiles: '업로드할 파일이 없습니다.',
      },
      status: 400,
      message: "Upload failed",
    }
  }

  const channelTalkUpload = await Promise.all(channelTalkFiles.map(async (file: File) => {
    return await fileUpload(file, orgKey);
  }));

  if (channelTalkUpload.some(upload => upload.error)) {
    return {
      errors: {
        channelTalkFiles: channelTalkUpload.map(upload => upload.message).join(', '),
      },
      status: 400,
      message: "Upload failed",
    }
  }

  const miscUpload = await Promise.all(miscFiles.map(async (file: File) => {
    return await fileUpload(file, orgKey);
  }))

  if (miscUpload.some(upload => upload.error)) {
    return {
      errors: {
        miscFiles: miscUpload.map(upload => upload.message).join(', '),
      },
      status: 400,
      message: "Upload failed",
    }
  }

  return {
    errors: null,
    status: 200,
    message: "Upload successful",
  }
}

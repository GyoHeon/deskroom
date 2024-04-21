import { UploadForm } from "./UploadForm";
import { getUploadJobs } from "./actions";

export default async function UploadPage({ searchParams }) {
  await getUploadJobs(searchParams?.org); 

  return <UploadForm />;
}

import Spinner from "@/components/Spinner";

export type JobStatus = 'CREATED' | 'PENDING' | 'DONE' | 'FAILED'
export const JobStatusCircle = ({ status }: { status: JobStatus }) => {
  if (status === 'CREATED') {
    return <Spinner size={8} />
  }
  if (status === 'PENDING') {
    return <Spinner size={8} shouldSpin />
  }
  if (status === 'DONE') {
    return <Spinner size={8} done />
  }
  if (status === 'FAILED') {
    return <Spinner size={8} failed />
  }
}


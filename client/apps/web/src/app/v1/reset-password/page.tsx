import { useRouter } from 'next/router';

const ResetPasswordPage = () => {
  const { query } = useRouter();
  const { token } = query;

  return (
    <></>
    //<ResetPasswordComponent token={token as string} />
  );
}

export default ResetPasswordPage; 

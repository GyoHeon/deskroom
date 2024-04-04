import { ResetPasswordForm } from './ResetPasswordForm';
import Image from "next/image";

const ResetPasswordPage = () => {
  return (
    <>
      <Image src="/deskroom-icon.png" alt="Deskroom Logo" width={60} height={60} className="my-8" />
      <ResetPasswordForm />
    </>
  );
}

export default ResetPasswordPage; 

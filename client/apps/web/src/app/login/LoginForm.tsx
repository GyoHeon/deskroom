"use client";

import { useFormState } from "react-dom";
import { signIn } from "../auth/login/actions";

export type LoginState = {
  errors: string | null;
  status: number | null;
};
const initialState: LoginState = {
  errors: null,
  status: null,
};

export default function LoginForm() {
  const [state, formAction] = useFormState(signIn, initialState);
  return (
    <>
      <form action={formAction} method="POST" encType="multipart/form-data">
        <div className="my-2">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Your Email"
            className="w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out my-2 shadow"
          />
        </div>
        <div className="my-2">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Your Password"
            className="w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out my-2 shadow"
          />
        </div>
        <p className="my-4 w-full h-4 text-red-600 font-bold">
          {state?.errors}
        </p>

        <div className="flex justify-center items-center mt-8 shadow">
          <button
            type="submit"
            className="bg-gray-950 hover:bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Login
          </button>
        </div>

        <span className="text-sm text-gray-400 my-8">
          No Account?{" "}
          <a
            href="mailto:kp@deskroom.so"
            className="text-blue-500 hover:text-blue-600"
          >
            Email us!
          </a>
        </span>
      </form>
    </>
  );
}

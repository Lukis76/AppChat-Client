import { ChangeEvent, FormEvent, useState } from "react";

export const useForm = (callback: () => void, initialState = {}) => {
  const [values, setValues] = useState(initialState);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.name !== "confirmPassword") {
      setValues({ ...values, [e.target.name]: e.target.value });
    }
  };

  const onSubmit = async (e: FormEvent<HTMLElement>) => {
    e.preventDefault();
    await callback();
    // router.push('/login')
  };

  return {
    onChange,
    onSubmit,
    values,
  };
};

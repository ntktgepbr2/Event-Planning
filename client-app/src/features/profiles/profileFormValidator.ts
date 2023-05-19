import { ProfileFormValues } from "../../app/models/profile";

const validateProfileForm = (values: ProfileFormValues) => {
  const errors: Partial<ProfileFormValues> = {};

  if (!values.displayName) {
    errors.displayName = "Display Name is required";
  }

  return errors;
};

export default validateProfileForm;

import { ProfileFormValues } from "../../app/models/profile";

const validateProfileForm = (values: ProfileFormValues) => {
  const errors: Partial<ProfileFormValues> = {};

  if (!values.displayName) {
    errors.displayName = "Display Name is required";
  }

  if (!values.firstName) {
    errors.firstName = "First Name is required";
  }

  if (!values.secondName) {
    errors.secondName = "Second Name is required";
  }

  if (!values.gender) {
    errors.gender = "Gender is required";
  }

  if (!values.phone) {
    errors.phone = "Phone is required";
  }

  if (!values.address) {
    errors.address = "Address is required";
  }

  if (!values.birthday) {
    errors.birthday = "Birthday is required";
  }

  return errors;
};

export default validateProfileForm;

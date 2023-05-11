import { useField } from "formik";
import { Label, Form } from "semantic-ui-react";

interface Props {
  placeholder: string;
  name: string;
  rows: number;
  type?: string;
  label?: string;
}

export default function MyTextArea(props: Props) {
  const [field, meta] = useField(props.name);
  return (
    <Form.Field error={meta.touched && !!meta.error}>
      <label>{props.label}</label>
      <textarea {...field} {...props}></textarea>
      {meta.touched && meta.error ? (
        <Label basic color='red'>
          {meta.error}
        </Label>
      ) : null}
    </Form.Field>
  );
}

import { ErrorMessage, Form, Formik } from "formik";
import { Button, Header } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import MyTextInput from "../../app/common/form/MyTextInput";
import ValidationErrors from "../errors/ValidationErrors";

export default observer(function RegisterForm() {
  const { userStore } = useStore();
  return (
    <Formik
      initialValues={{ displayName: "", userName: "", email: "", password: "", error: null }}
      onSubmit={(values, { setErrors }) =>
        userStore.register(values).catch((error) => setErrors({ error }))
      }
    >
      {({ handleSubmit, isSubmitting, errors }) => (
        <Form className='ui form error' onSubmit={handleSubmit} autoComplete='off'>
          <Header as='h2' content='Sign up' color='teal' textAlign='center' />
          <MyTextInput name='displayName' placeholder='DisplayName'></MyTextInput>
          <MyTextInput name='userName' placeholder='UserName'></MyTextInput>
          <MyTextInput name='email' placeholder='Email'></MyTextInput>
          <MyTextInput name='password' placeholder='Password' type='password'></MyTextInput>
          <ErrorMessage
            name='error'
            render={() => <ValidationErrors errors={errors.error} />}
          ></ErrorMessage>
          <Button loading={isSubmitting} positive content='Register' type='submit' fluid></Button>
        </Form>
      )}
    </Formik>
  );
});

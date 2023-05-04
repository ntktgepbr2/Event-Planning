import { ErrorMessage, Form, Formik } from "formik";
import { Button, Header, Label } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import MyTextInput from "../../app/common/form/MyTextInput";

export default observer(function RegisterForm() {
  const { userStore } = useStore();
  return (
    <Formik
      initialValues={{ displayName: "", userName: "", email: "", password: "", error: null }}
      onSubmit={(values, { setErrors }) =>
        userStore
          .register(values)
          .catch((error) => setErrors({ error: "Duplicated or invalid data." }))
      }
    >
      {({ handleSubmit, isSubmitting, errors }) => (
        <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
          <Header as='h2' content='Sign up' color='teal' textAlign='center' />
          <MyTextInput name='displayName' placeholder='DisplayName'></MyTextInput>
          <MyTextInput name='userName' placeholder='UserName'></MyTextInput>
          <MyTextInput name='email' placeholder='Email'></MyTextInput>
          <MyTextInput name='password' placeholder='Password' type='password'></MyTextInput>
          <ErrorMessage
            name='error'
            render={() => (
              <Label style={{ marginBottom: 10 }} basic color='red' content={errors.error}></Label>
            )}
          ></ErrorMessage>
          <Button loading={isSubmitting} positive content='Register' type='submit' fluid></Button>
        </Form>
      )}
    </Formik>
  );
});

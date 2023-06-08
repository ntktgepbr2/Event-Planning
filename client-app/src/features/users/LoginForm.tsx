import { ErrorMessage, Form, Formik } from "formik";
import { Button, Header, Label } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import MyTextInput from "../../app/common/form/MyTextInput";
import { useHistory } from "react-router-dom";

export default observer(function LoginForm() {
  const { userStore } = useStore();
  const history = useHistory();

  return (
    <Formik
      initialValues={{ email: "", password: "", error: null }}
      onSubmit={(values, { setErrors }) =>
        userStore
          .login(values)
          .then(() => history.push("/events"))
          .catch((error) => setErrors({ error: error.response.data }))
      }
    >
      {({ handleSubmit, isSubmitting, errors }) => (
        <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
          <Header as='h2' content='Login to Event Planning' color='teal' textAlign='center' />
          <MyTextInput name='email' placeholder='Email'></MyTextInput>
          <MyTextInput name='password' placeholder='Password' type='password'></MyTextInput>
          <ErrorMessage
            name='error'
            render={() => (
              <Label style={{ marginBottom: 10 }} basic color='red' content={errors.error}></Label>
            )}
          ></ErrorMessage>
          <Button loading={isSubmitting} positive content='Login' type='submit' fluid></Button>
        </Form>
      )}
    </Formik>
  );
});

import { Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Button, Header, Segment } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import MyTextInput from "../../app/common/form/MyTextInput";
import { ProfileFormValues } from "../../app/models/profile";
import { useHistory } from "react-router-dom";
import validateProfileForm from "./profileFormValidator";

const ProfileForm = () => {
  const {
    profileStore: { updateProfile, profile },
  } = useStore();
  const history = useHistory();
  const [profileFormValues] = useState<ProfileFormValues>(new ProfileFormValues());

  return (
    <Segment clearing>
      <Header content='Edit Profile' sub color='teal' />
      <Formik
        validate={validateProfileForm}
        initialValues={profileFormValues}
        onSubmit={(values: ProfileFormValues, { setSubmitting }) => {
          values.userName = profile?.userName;
          updateProfile(values)
            .then(() => setSubmitting(false))
            .then(() => history.push("/profiles/:username"))
            .catch((error) => console.log("Error updating profile: ", error));
        }}
      >
        {({ isSubmitting, isValid, dirty }) => (
          <Form className='ui form'>
            <MyTextInput name='displayName' placeholder='Display Name' />
            <MyTextInput name='bio' placeholder='Bio' />
            <MyTextInput name='firstName' placeholder='First Name' />
            <MyTextInput name='secondName' placeholder='Second Name' />
            <MyTextInput name='gender' placeholder='Gender' />
            <MyTextInput name='phone' placeholder='Phone' />
            <MyTextInput name='address' placeholder='Address' />
            <MyTextInput name='birthday' placeholder='Birthday' type='date' />
            <Button
              loading={isSubmitting}
              disabled={isSubmitting || !isValid || !dirty}
              floated='right'
              positive
              type='submit'
              content='Update profile'
            />
          </Form>
        )}
      </Formik>
    </Segment>
  );
};

export default observer(ProfileForm);

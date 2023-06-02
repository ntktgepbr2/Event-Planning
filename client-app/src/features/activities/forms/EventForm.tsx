import { ChangeEvent, useEffect, useState } from "react";
import { Button, Header, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { Link, useHistory, useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { EventFormValues } from "../../../app/models/event";
import { Field as UserField } from "../../../app/models/field";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import MyTextInput from "../../../app/common/form/MyTextInput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MySelectInput from "../../../app/common/form/MySelectInput";
import MyDateInput from "../../../app/common/form/MyDateInput";
import { categoryOptions } from "../../../app/common/options/categoryOptions";

export default observer(function EventForm() {
  const { eventStore } = useStore();
  const { createEvent, updateEvent, loading, loadEvent, loadingInitial } = eventStore;
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [event, setEvent] = useState<EventFormValues>(new EventFormValues());
  const [fields, setFields] = useState<UserField[]>([]);

  const validationSchema = Yup.object({
    title: Yup.string().required("The event title is required"),
    description: Yup.string().required("The description title is required"),
    category: Yup.string().required(),
    date: Yup.string().required("The date is required"),
    city: Yup.string().required(),
  });

  useEffect(() => {
    if (id) loadEvent(id).then((event) => setEvent(new EventFormValues(event)));
  }, [id, loadEvent, fields]);

  function handleFormSubmit(event: EventFormValues) {
    if (!event.id) {
      let newEvent = {
        ...event,
        id: uuid(),
        fields: fields,
      };
      createEvent(newEvent).then(() => history.push(`/events/${newEvent.id}`));
    } else {
      updateEvent({ ...event, fields: fields }).then(() => history.push(`/events/${event.id}`));
    }
  }

  // function handleSubmit(evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
  //   const { name, value } = evt.target;
  //   console.log(name, value);
  //   setEvent((prevEvent) => ({ ...prevEvent, [name]: value }));
  // }

  const handleAdditionalInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const fieldIndex = parseInt(name);
    const updatedFields = fields.map((field) => {
      if (field.id === fieldIndex) {
        return { ...field, value };
      }
      return field;
    });
    setFields(updatedFields);
    setEvent((prevState) => {
      const updatedFields = prevState.fields.map((field) => {
        if (field.id === fieldIndex) {
          return { ...field, value };
        }

        return field;
      });
      return { ...prevState, fields: updatedFields };
    });
  };

  const handleAddField = () => {
    const newField = { id: fields.length, name: "", value: "" };

    setFields([...fields, newField]);
    setEvent((prevState) => ({ ...prevState, fields: [...prevState.fields, newField] }));
  };

  const handleRemoveField = () => {
    const updatedFields = [...fields];

    updatedFields.pop();
    setFields(updatedFields);

    setEvent((prevState) => {
      return { ...prevState, fields: updatedFields };
    });
  };

  return (
    <Segment clearing>
      <Header content='Event details' sub color='teal' />
      <Formik
        validationSchema={validationSchema}
        enableReinitialize
        initialValues={event}
        onSubmit={(values) => handleFormSubmit(values)}
      >
        {({ handleSubmit, isValid, isSubmitting, dirty }) => (
          <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
            <MyTextInput placeholder='Title' name='title' />
            <MyTextArea rows={3} placeholder='Description' name='description' />
            <MySelectInput options={categoryOptions} placeholder='Category' name='category' />
            <MyDateInput
              placeholderText='Date'
              name='date'
              showTimeSelect
              timeCaption='time'
              dateFormat='MMMM d, yyyy h:mm aa'
            />
            <MyTextInput placeholder='City' name='city' />
            <MyTextInput placeholder='Maximum attendees' name='maximumAttendees' />
            {fields?.map((field: UserField, index) => (
              <div key={index}>
                <Field
                  placeholder={`Field ${index + 1} Name`}
                  name={`${index}Name`}
                  onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                    const value = evt.target.value;
                    const fieldIndex = parseInt(evt.target.name);
                    const updatedFields = fields.map((field) => {
                      if (field.id === fieldIndex) {
                        return { ...field, name: value };
                      }
                      return field;
                    });
                    setFields(updatedFields);
                    setEvent((prevState) => {
                      const updatedFields = prevState.fields.map((field) => {
                        if (field.id === fieldIndex) {
                          return { ...field, name: value };
                        }
                        return field;
                      });
                      return { ...prevState, fields: updatedFields };
                    });
                  }}
                />
                <Field
                  placeholder={`Field ${index + 1} Value`}
                  value={field.value}
                  name={`${index}`}
                  onChange={handleAdditionalInputChange}
                />
              </div>
            ))}
            <Button type='button' onClick={handleAddField} content='Add Field' />
            <Button type='button' onClick={handleRemoveField} content='Remove Field' />
            <Button
              disabled={isSubmitting || !dirty || !isValid}
              floated='right'
              positive
              type='submit'
              content='Submit'
            />
            <Button as={Link} to='/events' floated='right' type='button' content='Cancel' />
          </Form>
        )}
      </Formik>
    </Segment>
  );
});

import { ChangeEvent, useEffect, useState } from "react";
import { Button, Form, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { Link, useHistory, useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { EventFormValues } from "../../../app/models/event";
import { Field } from "../../../app/models/field";

export default observer(function EventForm() {
  const { eventStore } = useStore();
  const { createEvent, updateEvent, loading, loadEvent, loadingInitial } = eventStore;
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [event, setEvent] = useState<EventFormValues>(new EventFormValues());
  const [fields, setFields] = useState<Field[]>([]);

  useEffect(() => {
    if (id) loadEvent(id).then((event) => setEvent(new EventFormValues(event)));
    // setFields(event.fields || []);
  }, [id, loadEvent, fields]);

  function handleSubmit() {
    if (!event.id) {
      let newEvent = {
        ...event,
        id: uuid(),
        fields: fields,
      };
      console.log(newEvent);
      createEvent(newEvent).then(() => history.push(`/events/${newEvent.id}`));
    } else {
      updateEvent({ ...event, fields: fields }).then(() => history.push(`/events/${event.id}`));
    }
  }

  function handleInputChange(evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = evt.target;
    console.log(name, value);
    setEvent((prevEvent) => ({ ...prevEvent, [name]: value }));
  }

  const handleAdditionalInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    console.log(name, "   ", value);
    const fieldIndex = parseInt(name);
    const updatedFields = fields.map((field) => {
      if (field.id === fieldIndex) {
        return { ...field, value };
      }
      return field;
    });
    setFields(updatedFields);
    console.log(fields);
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
      const updatedFields = [...prevState.fields];
      updatedFields.pop();
      return { ...prevState, fields: updatedFields };
    });
  };

  return (
    <Segment clearing>
      <Form onSubmit={handleSubmit} autocomlete='off'>
        <Form.Input
          placeholder='Title'
          value={event.title}
          name='title'
          onChange={handleInputChange}
        />
        <Form.TextArea
          placeholder='Description'
          value={event.description}
          name='description'
          onChange={handleInputChange}
        />
        <Form.Input
          placeholder='Category'
          value={event.category}
          name='category'
          onChange={handleInputChange}
        />
        <Form.Input
          type='date'
          placeholder='Date'
          value={event.date}
          name='date'
          onChange={handleInputChange}
        />
        <Form.Input
          placeholder='City'
          value={event.city}
          name='city'
          onChange={handleInputChange}
        />
        <Form.Input
          placeholder='Maximum attendees'
          value={event.maximumAttendees}
          name='maximumAttendees'
          onChange={handleInputChange}
        />
        {fields?.map((field: Field, index) => (
          <Form.Group key={index}>
            <Form.Input
              placeholder={`Field ${index + 1} Name`}
              name={`${index}Name`}
              onChange={(evt) => {
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
            <Form.Input
              placeholder={`Field ${index + 1} Value`}
              value={field.value}
              name={`${index}`}
              onChange={handleAdditionalInputChange}
            />
          </Form.Group>
        ))}
        <Button type='button' onClick={handleAddField} content='Add Field' />
        <Button type='button' onClick={handleRemoveField} content='Remove Field' />
        <Button loading={loading} floated='right' positive type='submit' content='Submit' />
        <Button as={Link} to='/events' floated='right' type='button' content='Cancel' />
      </Form>
    </Segment>
  );
});

import { observer } from "mobx-react-lite";
import React from "react";
import { Segment, Grid, Icon } from "semantic-ui-react";
import { Event } from "../../../app/models/event";

interface Props {
  event: Event;
}

export default observer(function EventDetailedInfo({ event }: Props) {
  return (
    <Segment.Group>
      <Segment attached='top'>
        <Grid>
          <Grid.Column width={1}>
            <Icon size='large' color='teal' name='info' />
          </Grid.Column>
          <Grid.Column width={15}>
            <p>{event.description}</p>
          </Grid.Column>
        </Grid>
      </Segment>
      <Segment attached>
        <Grid verticalAlign='middle'>
          <Grid.Column width={1}>
            <Icon name='calendar' size='large' color='teal' />
          </Grid.Column>
          <Grid.Column width={15}>
            <span>{event.date}</span>
          </Grid.Column>
        </Grid>
      </Segment>
      <Segment attached>
        <Grid verticalAlign='middle'>
          <Grid.Column width={1}>
            <Icon name='marker' size='large' color='teal' />
          </Grid.Column>
          <Grid.Column width={11}>
            <span>{event.city}</span>
          </Grid.Column>
        </Grid>
      </Segment>
      <Segment attached>
        <Grid verticalAlign='middle'>
          <Grid.Column width={1}>
            <Icon name='users' size='large' color='teal' />
          </Grid.Column>
          <Grid.Column width={11}>
            <span>Maximum attendees {event.maximumAttendees}</span>
          </Grid.Column>
        </Grid>
      </Segment>
      {event.fields &&
        event.fields.map((field) => {
          console.log(field);
          return (
            <>
              <Segment attached>
                <Grid verticalAlign='middle'>
                  <Grid.Column width={1}>
                    <Icon name='bookmark' size='large' color='teal' />
                  </Grid.Column>
                  <Grid.Column width={11}>
                    <span>
                      {field.name} : {field.value}
                    </span>
                  </Grid.Column>
                </Grid>
              </Segment>
            </>
          );
        })}
    </Segment.Group>
  );
});

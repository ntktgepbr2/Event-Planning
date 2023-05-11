import { Link } from "react-router-dom";
import { Button, Icon, Item, ItemGroup, Label, Segment } from "semantic-ui-react";
import { Event } from "../../../app/models/event";
import { observer } from "mobx-react-lite";
import EventListItemAtendee from "./EventListItemAtendee";
import { format } from "date-fns";

interface Props {
  event: Event;
}

export default observer(function EventListItem({ event }: Props) {
  return (
    <Segment.Group>
      <Segment>
        {event.isCanceled && (
          <Label
            attached='top'
            color='red'
            content='Canceled'
            style={{ textAlighn: "center" }}
          ></Label>
        )}
        <Item.Group>
          <Item>
            <Item.Image size='tiny' circular src='/assets/user.png' />
            <Item.Content>
              <Item.Header as={Link} to={`/events/${event.id}`}>
                {event.title}
              </Item.Header>
              <Item.Description>Hosted by {event.host?.displayName}</Item.Description>
              {event.isHost && (
                <Item.Description>
                  <Label basic color='orange'>
                    You are hosting this event.
                  </Label>
                </Item.Description>
              )}
              {event.isGoing && !event.isHost && (
                <Item.Description>
                  <Label basic color='green'>
                    You are going to this event.
                  </Label>
                </Item.Description>
              )}
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <span>
          <Icon name='clock' />
          {format(event.date!, "dd MMM yyyy h:mm aa")}
        </span>
      </Segment>
      {event.fields &&
        event.fields.map((field) => {
          console.log(field);
          return (
            <>
              <Segment key={field.id}>
                <span>
                  <Icon name='bookmark' />
                  {field.name} : {field.value}
                </span>
              </Segment>
            </>
          );
        })}
      <Segment secondary>
        <EventListItemAtendee attendees={event.attendees!} />
      </Segment>
      <Segment clearing>
        <span>{event.description}</span>
        <Button as={Link} to={`/events/${event.id}`} color='teal' floated='right' content='View' />
      </Segment>
    </Segment.Group>
  );
});

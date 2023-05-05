import { observer } from "mobx-react-lite";
import { List, Image } from "semantic-ui-react";
import { Profile } from "../../../app/models/profile";

interface Props {
  attendees: Profile[];
}

export default observer(function ActivityListItemAtendee({ attendees }: Props) {
  return (
    <List horizontal>
      {attendees.map((attendee) => (
        <List.Item key={attendee.userName}>
          <Image size='mini' circular src={attendee.image || "/assets/user.png"} />
        </List.Item>
      ))}
    </List>
  );
});

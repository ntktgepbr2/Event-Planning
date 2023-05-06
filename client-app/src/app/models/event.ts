import { Profile } from "./profile";
import { Field } from "./field";

export interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  category: string;
  city: string;
  maximumAttendees: number;
  isMaximumAttendensReached: boolean;
  hostUserName?: string;
  isCanceled: boolean;
  isHost: boolean;
  isGoing: boolean;
  host?: Profile;
  attendees: Profile[];
  fields: Field[];
}

export class Event implements Event {
  constructor(init?: EventFormValues) {
    Object.assign(this, init);
  }
}

export class EventFormValues {
  id?: string = undefined;
  title: string = "";
  category: string = "";
  description: string = "";
  date: string = "";
  city: string = "";
  maximumAttendees?: number;
  fields: Field[] = [];

  constructor(event?: EventFormValues) {
    if (event) {
      this.id = event.id;
      this.title = event.title;
      this.category = event.category;
      this.description = event.description;
      this.date = event.date;
      this.city = event.city;
      this.maximumAttendees = event.maximumAttendees;
      this.fields = event.fields;
    }
  }
}

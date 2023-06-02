import { makeAutoObservable, runInAction } from "mobx";
import { Event, EventFormValues } from "../models/event";
import agent from "../api/agent";
import { store } from "./store";
import { Profile } from "../models/profile";
import { format } from "date-fns";
import { Pagination, PagingParams } from "../models/pagination";

export default class EventStore {
  events: Event[] = [];
  selectedEvent: Event | undefined;
  editMode = false;
  loading = false;
  loadingInitial = false;
  pagination: Pagination | null = null;
  pagingParams = new PagingParams();
  predicate = new Map().set("all", true);

  constructor() {
    makeAutoObservable(this);
  }

  setPagingParams = (pagingparams: PagingParams) => {
    this.pagingParams = pagingparams;
  };

  setPredicate = (predicate: string, value:string | Date) => {
    switch(predicate){
      case 'all':
    }
  };

  get axiosParams() {
    const params = new URLSearchParams();

    params.append("pageNumber", this.pagingParams.pageNumber.toString());
    params.append("pageSize", this.pagingParams.pageSize.toString());

    this.predicate.forEach((value, key) => {
      if (key === "startDate") {
        params.append(key, (value as Date).toISOString());
      } else {
        params.append(key, value);
      }
    });

    return params;
  }

  get eventsByDate() {
    return this.events.slice().sort((a, b) => a.date!.getTime() - b.date!.getTime());
  }

  get groupedEvents() {
    return Object.entries(
      this.eventsByDate.reduce((events, event) => {
        const date = format(event.date, "dd MMM yyyy");
        events[date] = events[date] ? [...events[date], event] : [event];
        return events;
      }, {} as { [key: string]: Event[] })
    );
  }

  loadEvents = async () => {
    try {
      this.setLoadingInitial(true);
      const result = await agent.events.list(this.axiosParams);
      this.events = this.events.concat(result.data);
      this.events.forEach((event) => {
        this.setEvent(event);
      });
      this.setPagination(result.pagination);
      this.setLoadingInitial(false);
    } catch (error) {
      console.log(error);
      this.setLoadingInitial(false);
    }
  };

  setPagination = (pagination: Pagination) => {
    this.pagination = pagination;
  };

  loadEvent = async (id: string) => {
    let event = this.getEvent(id);
    if (event) {
      this.selectedEvent = event;
      return event;
    } else {
      this.setLoadingInitial(true);
      try {
        event = await agent.events.details(id);
        this.setEvent(event);
        this.events.push(event);
        this.selectedEvent = event;
        this.setLoadingInitial(false);
        return event;
      } catch (error) {
        console.log(error);
        this.setLoadingInitial(false);
      }
    }
  };

  private setEvent = (event: Event) => {
    const user = store.userStore.user;
    if (user) {
      event.isGoing = event.attendees?.some((a) => a.userName === user.userName);

      event.isHost = event.hostUserName === user.userName;
      event.host = event.attendees?.find((x) => x.userName === event.hostUserName);
    }
    event.date = new Date(event.date!);
  };

  private getEvent = (id: string) => {
    return this.events.find((a) => a.id === id);
  };

  setLoadingInitial(state: boolean) {
    this.loadingInitial = state;
  }

  createEvent = async (event: EventFormValues) => {
    const user = store.userStore.user;
    const attendee = new Profile(user!);
    try {
      await agent.events.create(event);
      runInAction(async () => {
        const newEvent = new Event(event);
        newEvent.hostUserName = user!.userName;
        newEvent.attendees = [attendee];
        this.setEvent(newEvent);
        this.selectedEvent = newEvent;
      });
    } catch (error) {
      console.log(error);
    }
  };

  updateEvent = async (event: EventFormValues) => {
    try {
      await agent.events.update(event);
      runInAction(async () => {
        if (event.id) {
          let updatedEvent = { ...this.getEvent(event.id), ...event };
          this.events = this.events.filter((x) => x.id !== event.id);
          this.events.push(updatedEvent as Event);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  deleteEvent = async (id: string) => {
    try {
      runInAction(async () => {
        this.loading = true;
        await agent.events.delete(id);
        this.events = [...this.events.filter((a) => a.id !== id)];
        this.loading = false;
      });
      this.loading = false;
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  updateAttendance = async (isCanceling: boolean = false) => {
    if (!isCanceling) {
      this.isMaximumAttendanceReached();
      if (this.selectedEvent!.isMaximumAttendensReached) return;
    }
    const user = store.userStore.user;
    this.loading = true;
    try {
      await agent.events.attend(this.selectedEvent!.id);
      runInAction(() => {
        if (this.selectedEvent?.isGoing) {
          this.selectedEvent.attendees = this.selectedEvent.attendees?.filter(
            (a) => a.userName !== user?.userName
          );
          this.selectedEvent.isGoing = false;
          this.loading = false;
        } else {
          const attendee = new Profile(user!);
          this.selectedEvent?.attendees?.push(attendee);
          this.selectedEvent!.isGoing = true;
          this.loading = false;
        }
        this.events.push(this.selectedEvent!);
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  cancelEventToggle = async () => {
    this.loading = true;
    try {
      await agent.events.attend(this.selectedEvent!.id);
      runInAction(() => {
        this.selectedEvent!.isCanceled = !this.selectedEvent?.isCanceled;
        this.events = this.events.filter((x) => x.id !== this.selectedEvent?.id);
        this.events.push(this.selectedEvent as Event);
      });
    } catch (error) {
    } finally {
      this.loading = false;
    }
  };

  isMaximumAttendanceReached() {
    if (
      this.selectedEvent!.maximumAttendees > 0 &&
      this.selectedEvent!.attendees.length === this.selectedEvent!.maximumAttendees
    ) {
      this.selectedEvent!.isMaximumAttendensReached = true;
      return;
    } else {
      this.selectedEvent!.isMaximumAttendensReached = false;
    }
  }

  updateAttendeeFollowing = (userName: string) => {
    this.events.forEach((event) =>
      event.attendees.forEach((attendee) => {
        if (attendee.userName === userName) {
          attendee.following ? attendee.followersCount-- : attendee.followersCount++;
          attendee.following = !attendee.following;
        }
      })
    );
  };
}

import { makeAutoObservable, runInAction } from "mobx";
import { Activity, ActivityFormValues } from "../models/activity";
import agent from "../api/agent";
import { store } from "./store";
import { Profile } from "../models/profile";

export default class ActivityStore {
  activities: Activity[] = [];
  selectedActivity: Activity | undefined = undefined;
  editMode = false;
  loading = false;
  loadingInitial = true;

  constructor() {
    makeAutoObservable(this);
  }

  get activitiesByDate() {
    return this.activities.slice().sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
  }

  get groupedActivities() {
    return Object.entries(
      this.activitiesByDate.reduce((activities, activity) => {
        const date = activity.date;
        activities[date] = activities[date] ? [...activities[date], activity] : [activity];
        return activities;
      }, {} as { [key: string]: Activity[] })
    );
  }

  loadActivities = async () => {
    try {
      this.setLoadingInitial(true);
      this.activities = await agent.activities.list();
      this.activities.map((activity) => {
        this.setActivity(activity);
      });
      this.setLoadingInitial(false);
    } catch (error) {
      console.log(error);
      this.setLoadingInitial(false);
    }
  };

  loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      this.selectedActivity = activity;
      return activity;
    } else {
      this.setLoadingInitial(true);
      try {
        activity = await agent.activities.details(id);
        this.setActivity(activity);
        this.activities.push(activity);
        this.selectedActivity = activity;
        this.setLoadingInitial(false);
        return activity;
      } catch (error) {
        console.log(error);
        this.setLoadingInitial(false);
      }
    }
  };

  private setActivity = (activity: Activity) => {
    const user = store.userStore.user;
    if (user) {
      activity.isGoing = activity.attendees?.some((a) => a.userName === user.userName);

      activity.isHost = activity.hostUserName === user.userName;
      activity.host = activity.attendees?.find((x) => x.userName === activity.hostUserName);
    }
    activity.date = activity.date.split("T")[0];
  };

  private getActivity = (id: string) => {
    return this.activities.find((a) => a.id === id);
  };

  setLoadingInitial(state: boolean) {
    this.loadingInitial = state;
  }

  createActivity = async (activity: ActivityFormValues) => {
    const user = store.userStore.user;
    const attendee = new Profile(user!);
    try {
      await agent.activities.create(activity);
      runInAction(async () => {
        const newActivity = new Activity(activity);
        newActivity.hostUserName = user!.userName;
        newActivity.attendees = [attendee];
        this.setActivity(newActivity);
        this.selectedActivity = newActivity;
      });
    } catch (error) {
      console.log(error);
    }
  };

  updateActivity = async (activity: ActivityFormValues) => {
    try {
      await agent.activities.update(activity);
      runInAction(async () => {
        if (activity.id) {
          let updatedActivity = { ...this.getActivity(activity.id), ...activity };
          this.activities = this.activities.filter((x) => x.id !== activity.id);
          this.activities.push(updatedActivity as Activity);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  deleteActivity = async (id: string) => {
    try {
      runInAction(async () => {
        this.loading = true;
        await agent.activities.delete(id);
        this.activities = [...this.activities.filter((a) => a.id !== id)];
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

  updateAttendance = async () => {
    const user = store.userStore.user;
    this.loading = true;
    try {
      await agent.activities.attend(this.selectedActivity!.id);
      runInAction(() => {
        if (this.selectedActivity?.isGoing) {
          this.selectedActivity.attendees = this.selectedActivity.attendees?.filter(
            (a) => a.userName !== user?.userName
          );
          this.selectedActivity.isGoing = false;
          this.loading = false;
        } else {
          const attendee = new Profile(user!);
          this.selectedActivity?.attendees?.push(attendee);
          this.selectedActivity!.isGoing = true;
          this.loading = false;
        }
        this.activities.push(this.selectedActivity!);
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  cancelActivityToggle = async () => {
    this.loading = true;
    try {
      await agent.activities.attend(this.selectedActivity!.id);
      runInAction(() => {
        this.selectedActivity!.isCanceled = !this.selectedActivity?.isCanceled;
        this.activities = this.activities.filter((x) => x.id !== this.selectedActivity?.id);
        this.activities.push(this.selectedActivity as Activity);
      });
    } catch (error) {
    } finally {
      this.loading = false;
    }
  };
}

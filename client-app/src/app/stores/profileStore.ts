import { makeAutoObservable, reaction, runInAction } from "mobx";
import { Photo, Profile, ProfileFormValues } from "../models/profile";
import agent from "../api/agent";
import { store } from "./store";
import { UserEvent } from "../models/userEvent";

export default class ProfileStore {
  profile: Profile | null = null;
  uploading: boolean = false;
  loading: boolean = false;
  followings: Profile[] = [];
  loadingFollowings: boolean = false;
  loadingUserEvents: boolean = false;
  userEvents: UserEvent[] = [];
  activeTab = 0;
  userEventTab = 0;

  constructor() {
    makeAutoObservable(this);

    reaction(
      () => this.activeTab,
      (activeTab) => {
        if (activeTab === 3 || activeTab === 4) {
          const predicate = activeTab === 3 ? "followers" : "following";
          this.loadFollowings(predicate);
        } else {
          this.followings = [];
        }
      }
    );

    reaction(
      () => this.userEventTab,
      (userEventTab) => {
        if (userEventTab === 1 || userEventTab === 2) {
          const predicate = userEventTab === 1 ? "isPast" : "isHosting";
          this.loadUserEvents(predicate);
        } else {
          this.loadUserEvents("future");
        }
      }
    );
  }

  setActiveTab = (activeTab: any) => {
    this.activeTab = activeTab;
  };

  setUserEventTab = (userEventTab: any) => {
    this.userEventTab = userEventTab;
  };

  get isCurrentUser() {
    if (store.userStore.user && this.profile)
      return store.userStore.user.userName === this.profile.userName;

    return false;
  }

  loadLatestProfile = async (username: string) => {
    try {
      console.log(username);
      const profile = await agent.profiles.get(username);
      runInAction(() => {
        this.profile = profile;
      });
      return profile;
    } catch (error) {
      console.log(error);
    }
  };

  updateProfile = async (profileFormValues: ProfileFormValues) => {
    try {
      await agent.profiles.updateProfile(profileFormValues);
    } catch (error) {
      console.log(error);
    }
  };

  uploadPhoto = async (file: Blob) => {
    this.uploading = true;
    try {
      const response = await agent.profiles.uploadPhoto(file);
      const photo = response.data;
      runInAction(() => {
        if (this.profile) {
          this.profile.photos?.push(photo);
          if (photo.isMain && store.userStore.user) {
            store.userStore.setImage(photo.url);
            this.profile.image = photo.url;
          }
        }
        this.uploading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.uploading = false;
      });
    }
  };
  setMainPhoto = async (photo: Photo) => {
    this.loading = true;
    try {
      await agent.profiles.setMainPhoto(photo.id);
      store.userStore.setImage(photo.url);
      runInAction(() => {
        if (this.profile && this.profile.photos) {
          this.profile.photos.find((p) => p.isMain)!.isMain = false;
          this.profile.photos.find((p) => p.id === photo.id)!.isMain = true;
          this.profile.image = photo.url;
          this.loading = false;
        }
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  deletePhoto = async (photo: Photo) => {
    this.loading = true;
    try {
      await agent.profiles.deletePhoto(photo.id);
      runInAction(() => {
        if (this.profile) {
          this.profile.photos = this.profile.photos?.filter((p) => p.id !== photo.id);
          this.loading = false;
        }
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  updateFollowing = async (userName: string, following: boolean) => {
    this.loading = true;

    try {
      await agent.profiles.updateFollowing(userName);
      store.eventStore.updateAttendeeFollowing(userName);
      runInAction(() => {
        if (
          this.profile &&
          this.profile.userName !== store.userStore.user?.userName &&
          this.profile.userName === userName
        ) {
          following ? this.profile.followersCount++ : this.profile.followersCount--;
          this.profile.following = !this.profile.following;
        }
        if (this.profile && this.profile.userName === store.userStore.user?.userName) {
          following ? this.profile.followingCount++ : this.profile.followingCount--;
        }
        this.followings.forEach((profile) => {
          if (profile.userName === userName) {
            profile.following ? profile.followersCount-- : profile.followersCount++;
            profile.following = !profile.following;
          }
        });
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  loadFollowings = async (predicate: string) => {
    this.loadingFollowings = true;
    try {
      const followings = await agent.profiles.listFollowings(this.profile?.userName!, predicate);
      runInAction(() => {
        this.followings = followings;
        this.loadingFollowings = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loadingFollowings = false;
      });
    }
  };

  loadUserEvents = async (predicate: string) => {
    this.loadingUserEvents = true;
    try {
      const userEvents = await agent.profiles.listUserEvents(this.profile?.userName!, predicate);
      userEvents.forEach((event) => (event.date = new Date(event.date)));
      runInAction(() => {
        this.userEvents = userEvents;
        this.loadingUserEvents = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loadingUserEvents = false;
      });
    }
  };
}

import { makeAutoObservable, runInAction } from "mobx";
import { Photo, Profile, ProfileFormValues } from "../models/profile";
import agent from "../api/agent";
import { store } from "./store";

export default class ProfileStore {
  profile: Profile | null = null;
  uploading: boolean = false;
  loading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

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
}

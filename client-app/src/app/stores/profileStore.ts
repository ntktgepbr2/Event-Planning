import { makeAutoObservable, runInAction } from "mobx";
import { Profile, ProfileFormValues } from "../models/profile";
import agent from "../api/agent";

export default class ProfileStore {
  profile: Profile | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  loadProfile = async () => {
    try {
      const profile = await agent.profiles.getCurrentProfile();
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
      await agent.profiles.updateCurrentProfile(profileFormValues);
    } catch (error) {
      console.log(error);
    }
  };
}

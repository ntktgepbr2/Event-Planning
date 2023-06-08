import { makeAutoObservable, runInAction } from "mobx";
import { User, UserFormValues } from "../models/user";
import agent from "../api/agent";
import { store } from "./store";
import { history } from "../..";

export default class UserStore {
  user: User | null = null;
  refreshTokenTimeout: any;

  constructor() {
    makeAutoObservable(this);
  }

  get isLoggedIn() {
    return !!this.user;
  }

  login = async (creds: UserFormValues) => {
    try {
      const user = await agent.account.login(creds);
      store.commonStore.setToken(user.token);
      this.startRefreshTokenTimer(user);
      runInAction(() => (this.user = user));
      store.modalStore.closeModal();
    } catch (error) {
      throw error;
    }
  };

  logout = () => {
    store.commonStore.setToken(null);
    window.localStorage.removeItem("jwt");
    this.user = null;
    history.push("/");
  };

  getUser = async () => {
    try {
      const user = await agent.account.current();
      store.commonStore.setToken(user.token);
      runInAction(() => {
        this.user = user;
      });
      this.startRefreshTokenTimer(user);
    } catch (error) {
      console.log(error);
    }
  };
  register = async (creds: UserFormValues) => {
    try {
      await agent.account.register(creds);
      history.push(`/account/registerSuccess?email=${creds.email}`);
      store.modalStore.closeModal();
    } catch (error) {
      throw error;
    }
  };

  setImage = (image: string) => {
    if (this.user) this.user.image = image;
  };

  refreshToken = async () => {
    this.stopRefreshTokenTimer();
    try {
      const user = await agent.account.refreshToken();
      runInAction(() => {
        this.user = user;
      });
      store.commonStore.setToken(user.token);
      this.startRefreshTokenTimer(user);
    } catch (error) {
      console.log(error);
    }
  };

  private startRefreshTokenTimer(user: User) {
    const jwt = JSON.parse(atob(user.token.split(".")[1]));
    const expires = new Date(jwt.exp * 1000);
    const timeOut = expires.getTime() - Date.now() - 60 * 1000;

    this.refreshTokenTimeout = setTimeout(this.refreshToken, timeOut);
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }
}

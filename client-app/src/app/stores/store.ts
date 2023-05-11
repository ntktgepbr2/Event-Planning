import EventStore from "./eventStore";
import { createContext, useContext } from "react";
import UserStore from "./userStore";
import CommonStore from "./commonStore";
import ProfileStore from "./profileStore";
import ModalStore from "./modalStore";

interface Store {
  eventStore: EventStore;
  userStore: UserStore;
  commonStore: CommonStore;
  modalStore: ModalStore;
  profileStore: ProfileStore;
}

export const store: Store = {
  eventStore: new EventStore(),
  userStore: new UserStore(),
  commonStore: new CommonStore(),
  modalStore: new ModalStore(),
  profileStore: new ProfileStore(),
};

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}

import EventStore from "./eventStore";
import { createContext, useContext } from "react";
import UserStore from "./userStore";
import CommonStore from "./commonStore";

interface Store {
  eventStore: EventStore;
  userStore: UserStore;
  commonStore: CommonStore;
}

export const store: Store = {
  eventStore: new EventStore(),
  userStore: new UserStore(),
  commonStore: new CommonStore(),
};

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}

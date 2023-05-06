import axios, { AxiosResponse } from "axios";
import { Event, EventFormValues } from "../models/event";
import { User, UserFormValues } from "../models/user";
import { store } from "../stores/store";

axios.defaults.baseURL = "https://localhost:5001/api";
axios.interceptors.request.use((config) => {
  const token = store.commonStore.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});
axios.interceptors.response.use(async (response) => {
  try {
    await sleep(1000);
    return response;
  } catch (error) {
    console.log(error);
    return await Promise.reject(error);
  }
});

const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
  delete: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

const events = {
  list: () => requests.get<Event[]>("/events"),
  details: (id: string) => requests.get<Event>(`/events/${id}`),
  create: (event: EventFormValues) => requests.post<void>(`/events`, event),
  update: (event: EventFormValues) =>
    requests.put<void>(`/events/${event.id}`, event),
  delete: (id: string) => requests.delete<void>(`/events/${id}`),
  attend: (id: string) => requests.post<void>(`/events/${id}/attend`, {}),
};

const account = {
  current: () => requests.get<User>("/account"),
  login: (user: UserFormValues) => requests.post<User>("/account/login", user),
  register: (user: UserFormValues) => requests.post<User>("/account/register", user),
  verifyEmail: (token: string, email: string) =>
    requests.post<void>(`/account/verifyEmail?token=${token}&email=${email}`, {}),
  resendLink: (email: string) => requests.get(`/account/resendLink?&email=${email}`),
};

const agent = {
  events,
  account,
};

export default agent;

import axios, { AxiosResponse } from "axios";
import { Event, EventFormValues } from "../models/event";
import { User, UserFormValues } from "../models/user";
import { store } from "../stores/store";
import { Photo, Profile, ProfileFormValues } from "../models/profile";
import { toast } from "react-toastify";
import { history } from "../..";
import { PaginatedResult } from "../models/pagination";
import { UserEvent } from "../models/userEvent";

axios.defaults.baseURL = "http://localhost:5000/api";

axios.interceptors.request.use((config) => {
  const token = store.commonStore.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});
axios.interceptors.response.use(
  async (response) => {
    await sleep(1000);
    const pagination = response.headers["pagination"];

    if (pagination) {
      response.data = new PaginatedResult(response.data, JSON.parse(pagination));

      return response as AxiosResponse<PaginatedResult<any>>;
    }

    return response;
  },
  (error: any) => {
    const { data, status, config } = error.response!;

    switch (status) {
      case 400:
        if (typeof data === "string") {
          toast.error(data);
        }
        if (config.method === "get" && data.errors.hasOwnProperty("id")) {
          history.push("/not-found");
        }
        if (data.errors) {
          const modalStateErrors = [];
          for (const key in data.errors) {
            if (data.errors[key]) {
              modalStateErrors.push(data.errors[key]);
            }
          }
          throw modalStateErrors.flat();
        }
        break;
      case 401:
        toast.error("Unauthorized");
        break;
      case 404:
        history.push("/not-found");
        break;
      case 500:
        store.commonStore.setServerError(data);
        history.push("/server-error");
        break;
    }
    return Promise.reject(error);
  }
);

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
  list: (params: URLSearchParams) =>
    axios.get<PaginatedResult<Event[]>>("/events", { params }).then(responseBody),
  details: (id: string) => requests.get<Event>(`/events/${id}`),
  create: (event: EventFormValues) => requests.post<void>(`/events`, event),
  update: (event: EventFormValues) => requests.put<void>(`/events/${event.id}`, event),
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

const profiles = {
  updateProfile: (profile: ProfileFormValues) => requests.put<void>("/profiles", profile),
  get: (username: string) => requests.get<Profile>(`/profiles/${username}`),
  uploadPhoto: (file: Blob) => {
    let formData = new FormData();
    formData.append("File", file);

    return axios.post<Photo>("photos", formData, {
      headers: { "Content-type": "multipart/form-data" },
    });
  },
  setMainPhoto: (id: string) => requests.post(`/photos/${id}/setMain`, {}),
  deletePhoto: (id: string) => requests.delete(`/photos/${id}`),
  updateFollowing: (userName: string) => requests.post(`/follow/${userName}`, {}),
  listFollowings: (userName: string, predicate: string) =>
    requests.get<Profile[]>(`/follow/${userName}?predicate=${predicate}`),
  listUserEvents: (userName: string, predicate: string) =>
    requests.get<UserEvent[]>(`/profiles/${userName}/events?predicate=${predicate}`),
};

const agent = {
  events,
  account,
  profiles,
};

export default agent;

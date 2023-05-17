import { User } from "./user";

export interface Profile {
  userName: string;
  displayName: string;
  bio?: string;
  image?: string;
  firstName?: string;
  secondName?: string;
  gender?: string;
  phone?: string;
  address?: string;
  birthday?: string;
  photos?: Photo[];
}

export class Profile implements Profile {
  constructor(user: User) {
    this.userName = user.userName;
    this.displayName = user.displayName;
    this.image = user.image;
  }
}

export interface Photo {
  id: string;
  url: string;
  isMain: boolean;
}

export class ProfileFormValues {
  userName?: string = undefined;
  displayName?: string = undefined;
  bio: string = "";
  image: string = "";
  firstName: string = "";
  secondName: string = "";
  gender: string = "";
  phone: string = "";
  address: string = "";
  birthday: string = "";

  constructor(profile?: ProfileFormValues) {
    if (profile) {
      this.displayName = profile.displayName;
      this.bio = profile.bio;
      this.image = profile.image;
      this.firstName = profile.firstName;
      this.secondName = profile.secondName;
      this.gender = profile.gender;
      this.phone = profile.phone;
      this.address = profile.address;
      this.birthday = profile.birthday;
    }
  }
}

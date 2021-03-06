import {Dayjs} from "dayjs";

export interface RegisterResponse extends UserInfo {}

export interface LoginResponse {
  token: string;
}

export interface UserInfo {
  id: string;
  username: string;
}

export interface Context {
  userInfo: UserInfo;
}

export interface RatingInfo {
  username: string;
  note: number;
  comment: string;
}

export interface MovieInfo {
  id: string;
  name: string;
  releaseDate: Dayjs;
  duration: number;
  actors: string[];
  username: string;
  averageNote: number;
  ratings: RatingInfo[];
}

export interface MovieDeletionInfo {
  id?:string
}

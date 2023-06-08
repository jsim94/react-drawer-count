import axios from "axios";
import { CalcResult, HistoryItem, Schema, Submission } from "../types/CalcAppTypes";
import { User } from "../types/User";
import Token from "../types/Token";

export enum HttpMethod {
  GET = "get",
  POST = "post",
  PUT = "put",
  PATCH = "patch",
  DELETE = "delete",
}

export interface HttpError {
  response?: string;
}

export interface AuthPayload {
  username: string;
  password?: string;
}

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001/api";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 *
 */

export default class DrawerCounterApi {
  static instance: DrawerCounterApi | null = null;

  private _token: Token | null = null;
  baseUrl: string;

  static getInstance(): DrawerCounterApi {
    if (!DrawerCounterApi.instance) {
      DrawerCounterApi.instance = new DrawerCounterApi();
    }
    return DrawerCounterApi.instance!;
  }

  private constructor() {
    this.baseUrl = BASE_URL;
  }

  get token(): Token | null {
    return this._token;
  }

  set token(token: Token | null) {
    this._token = token;
  }

  resetToken() {
    this._token = null;
  }

  private async request(
    endpoint: string,
    data = {},
    method: HttpMethod = HttpMethod.GET
  ) {
    //there are multiple ways to pass an authorization token, this is how you pass it in the header.
    //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
    const url = `${this.baseUrl}/${endpoint}`;
    const headers = { Authorization: `Bearer ${this._token}` };
    const params = method === "get" ? data : {};
    if (process.env.REACT_APP_NODE_ENV !== "prod") {
      console.debug("REQUEST: " + method.toUpperCase() + " " + url, data);
    }
    try {
      const resp = await axios({ url, method, data, params, headers });
      return resp.data;
    } catch (err: any) {
      if (err.response) {
        console.error("API Error:", err.response);
        let message = err.response.data.error;
        throw Array.isArray(message) ? message : [message];
      }
      if (err.message === "Network Error") {
        throw ["No response from server"];
      }
      throw ["An error has occured"];
    }
  }

  /** Get if user exists */
  async checkUsername(data: { username: string }) {
    return await this.request("auth/check", data, HttpMethod.POST);
  }

  /** Get auth token for user */
  async authenticateUser(data: AuthPayload) {
    const resp = await this.request("auth/token", data, HttpMethod.POST);
    return resp.token;
  }

  /** Register a new user */
  async registerUser(data: AuthPayload): Promise<Token> {
    const resp = await this.request(`auth/register`, data, HttpMethod.POST);
    return resp.token;
  }

  /** Get details on a user by username. */
  async getUser(username: string): Promise<User> {
    let res = await this.request(`users/${username}`);
    return res.user;
  }

  /** Update user details. */
  async updateUser(username: string, data: any): Promise<User> {
    let res = await this.request(`users/${username}`, data, HttpMethod.PATCH);
    return res.user;
  }

  async submitHistory(data: Submission): Promise<CalcResult> {
    let res = await this.request(`history/`, data, HttpMethod.POST);
    return res.submission;
  }

  async getUserHistory(): Promise<HistoryItem[]> {
    let res = await this.request(`history/user`);
    return res.submissions as HistoryItem[];
  }

  async getHistory(id: string): Promise<CalcResult> {
    let res = await this.request(`history/${id}`);
    return res.submission;
  }

  async getSchema(schemaName: string): Promise<Schema> {
    return await this.request(`history/schema/${schemaName}`);
  }

  async deleteAllHistory(): Promise<{ message: string }> {
    return await this.request(`history/user`, {}, HttpMethod.DELETE);
  }
}

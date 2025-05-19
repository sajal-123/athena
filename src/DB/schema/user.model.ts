import mongoose, { Schema, Document } from 'mongoose';

interface IRepo {
  name: string;
  desc: string;
  language: string;
}

interface ISummary {
  primary_skills: string[];
  tech_stack: string[];
  notable_contributions: string[];
}

interface IUser {
  username: string;
  name: string;
  link: string;
  bio: string;
  location: string;
  contributionCount: String;
  repos: IRepo[];
  summary: ISummary;
  readme: string;
}

export interface IQueryUser extends Document {
  queryName: string;
  users: IUser[];
}

const RepoSchema = new Schema<IRepo>({
  name: { type: String, required: true },
  desc: { type: String },
  language: { type: String },
});

const SummarySchema = new Schema<ISummary>({
  primary_skills: [{ type: String }],
  tech_stack: [{ type: String }],
  notable_contributions: [{ type: String }],
});

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true },
  name: { type: String, required: true },
  link: { type: String, required: true },
  bio: { type: String },
  location: { type: String },
  contributionCount: { type: String, default: "0" },
  repos: { type: [RepoSchema], default: [] },
  summary: { type: SummarySchema, default: {} },
  readme: { type: String },
});

const QueryUserSchema = new Schema<IQueryUser>({
  queryName: { type: String, required: true },
  users: { type: [UserSchema], required: true },
});

export default mongoose.model<IQueryUser>('QueryUser', QueryUserSchema);

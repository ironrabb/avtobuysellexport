import { MemberStatus, MemberType } from "../enums/member.enum";
export interface MemberInput {
  name: string;
  email: string;
  phone: string;
  password: string;
  type?: MemberType;
}
export interface MemberDocument {
  _id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  type: MemberType;
  status: MemberStatus;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

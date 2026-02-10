import { z } from 'zod';

export enum Role {
  ADMIN = 'ADMIN',
  SPEAKER = 'SPEAKER',
  OPERATOR = 'OPERATOR',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum Style {
  NEUTRAL = 'NEUTRAL',
  AD_HYPE = 'AD_HYPE',
}

export enum QAStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export const RoleSchema = z.nativeEnum(Role);
export const GenderSchema = z.nativeEnum(Gender);
export const StyleSchema = z.nativeEnum(Style);
export const QAStatusSchema = z.nativeEnum(QAStatus);

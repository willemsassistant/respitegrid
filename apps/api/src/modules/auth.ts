import {
  RegisterUserInput,
  UserRole,
  registerUserSchema,
} from '@respitegrid/types';
import { FastifyReply, FastifyRequest } from 'fastify';

export interface AuthContext {
  userId: string;
  role: UserRole;
}

export function parseRegistration(input: unknown): RegisterUserInput {
  return registerUserSchema.parse(input);
}

export function requireRole(allowedRoles: UserRole[]) {
  return async function roleGuard(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const role = request.headers['x-demo-role'];
    if (typeof role !== 'string' || !allowedRoles.includes(role as UserRole)) {
      return reply.forbidden('Insufficient role for this route');
    }
  };
}

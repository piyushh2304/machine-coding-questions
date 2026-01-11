import { Request } from 'express';
export interface UserPayload {
    id: string;
}
export interface AuthRequest extends Request {
    user?: UserPayload;
}
export interface RegisterUserBody {
    username: string;
    email: string;
    password?: string;
}
export interface LoginUserBody {
    email: string;
    password?: string;
}
export interface AuthResponse {
    token: string;
    user: {
        id: string;
        username: string;
        email: string;
    };
}
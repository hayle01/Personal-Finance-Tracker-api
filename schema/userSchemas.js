import {z} from 'zod';

export const createUserSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Email must be valid').min(1, 'Email is required'),
    password: z.string()
        .min(6, 'Password must be atleast 6 characters long')
        .max(20, 'Password must be atmost 20 characters long')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
})
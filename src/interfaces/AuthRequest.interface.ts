import { Request } from "express";
import { UserEntity } from "src/entities/User.entity";

export interface AuthRequest extends Request {
    user: UserEntity
}
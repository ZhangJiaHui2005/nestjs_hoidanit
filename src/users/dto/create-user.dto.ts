import {Prop} from "@nestjs/mongoose";
import {IsEmail, IsNotEmpty, IsString} from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

    @Prop()
    isActive: boolean;
}

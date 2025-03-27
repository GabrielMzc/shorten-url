import { IsString } from "class-validator";

export class ShortenUrlDto {

    @IsString()
    originalUrl: string;

}

export class UpdateUrlDto {

    @IsString()
    originalUrl: string;

    @IsString()
    shortUrl: string; 

}



import { IsBoolean, IsNotEmpty, IsOptional,IsNumber, IsArray, ArrayMinSize, IsString } from "class-validator";
import { Transform } from "class-transformer";
export class CreateChatDto {
  @IsOptional() 
  @IsString()
  name?: string;

  @IsArray()
  @ArrayMinSize(2, { message: "A chat must have at least two members." })
  @Transform(({ value }) => value.map(id => Number(id)))
  memberIds: number[];

  @IsBoolean()
  @IsOptional() 
  isGroup?: boolean;

  @IsNotEmpty()
  @IsNumber()
  userId: number; 
}

export class GetChatDto {
    @IsNotEmpty()
    @IsNumber()
    userId: number; 
  }
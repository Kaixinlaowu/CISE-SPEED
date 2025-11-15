// backend/src/dtos/create-article.dto.ts
import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';
export class CreateArticleDto {
  @IsString() @IsNotEmpty() title: string;
  @IsString() @IsNotEmpty() content: string;
  @IsString() @IsNotEmpty() category: string;
  @IsArray() @IsOptional() tags?: string[];
  @IsString() @IsNotEmpty() author: string; // 任意名字
}

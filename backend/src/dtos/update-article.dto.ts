import { PartialType } from '@nestjs/mapped-types';
import { CreateArticleDto } from './create-article.dto';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export class UpdateArticleDto extends PartialType(CreateArticleDto) {}

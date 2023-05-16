import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class createQuestionDto {
  @IsString()
  @IsNotEmpty()
  @Length(10, 500)
  @Transform(({ value }) => value?.trim?.())
  body: string;
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(1)
  correctAnswers: string[];
}

export class updateQuestionDto {
  @IsString()
  @IsNotEmpty()
  @Length(10, 500)
  @Transform(({ value }) => value?.trim?.())
  body: string;
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(1)
  correctAnswers: string[];
}

export class QuestionViewModel {
  id: string;
  body: string;
  correctAnswers: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}
export class publishedUpdateModel {
  @IsNotEmpty()
  @IsBoolean()
  published: boolean;
}
export class SubmitAnswerDto {
  @IsNotEmpty()
  @IsString()
  answer: string;
}

export class AnswerViewModel {
  questionId: number;
  answerStatus: 'Correct' | 'Incorrect';
  addedAt: string;
}

export class GetQuestionsPaginationDto {
  searchBodyTerm?: string;
  publishedStatus?: string;
  sortBy?: string;
  sortDirection?: string;
  pageNumber?: number;
  pageSize?: number;
}

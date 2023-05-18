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
import { Column, PrimaryGeneratedColumn } from 'typeorm';

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
  questionId: string;
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

export class PairGameViewModel {
  id: string;
  firstPlayerProgress: {
    answers: {
      questionId: string;
      answerStatus: 'Correct' | 'Incorrect';
      addedAt: string;
    }[];
    player: {
      id: string;
      login: string;
    };
    score: number;
  };

  secondPlayerProgress: {
    answers: {
      questionId: string;
      answerStatus: 'Correct' | 'Incorrect';
      addedAt: string;
    }[];
    player: {
      id: string;
      login: string;
    };
    score: number;
  } | null;

  questions: { id: string; body: string }[] | null;

  status: 'PendingSecondPlayer' | 'Active' | 'Finished';

  pairCreatedDate: string;

  startGameDate: string | null;

  finishGameDate: string | null;
}

export declare class createQuestionDto {
    body: string;
    correctAnswers: string[];
}
export declare class updateQuestionDto {
    body: string;
    correctAnswers: string[];
}
export declare class QuestionViewModel {
    body: string;
    correctAnswers: string[];
    published: boolean;
    createdAt: string;
    updatedAt: string;
}
export declare class publishedUpdateModel {
    published: boolean;
}
export declare class GetQuestionsPaginationDto {
    searchBodyTerm?: string;
    publishedStatus?: string;
    sortBy?: string;
    sortDirection?: string;
    pageNumber?: number;
    pageSize?: number;
}

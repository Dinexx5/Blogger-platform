export declare class CreateCommentModel {
    content: string;
}
export declare class UpdateCommentModel {
    content: string;
}
export declare class LikeInputModel {
    likeStatus: string;
}
export declare class CommentViewModel {
    id: string;
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    createdAt: string;
    likesInfo: {
        likesCount: number;
        dislikesCount: number;
        myStatus: string;
    };
    constructor(id: string, content: string, commentatorInfo: {
        userId: string;
        userLogin: string;
    }, createdAt: string, likesInfo: {
        likesCount: number;
        dislikesCount: number;
        myStatus: string;
    });
}
export declare class commentsForBloggerViewModel {
    id: string;
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    createdAt: string;
    likesInfo: {
        likesCount: number;
        dislikesCount: number;
        myStatus: string;
    };
    postInfo: {
        id: string;
        title: string;
        blogId: string;
        blogName: string;
    };
    constructor(id: string, content: string, commentatorInfo: {
        userId: string;
        userLogin: string;
    }, createdAt: string, likesInfo: {
        likesCount: number;
        dislikesCount: number;
        myStatus: string;
    }, postInfo: {
        id: string;
        title: string;
        blogId: string;
        blogName: string;
    });
}

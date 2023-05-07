export declare class NewestLikes {
    addedAt: string;
    userId: string;
    login: string;
}
export declare class createPostModel {
    title: string;
    shortDescription: string;
    content: string;
}
export declare class updatePostModel {
    title: string;
    shortDescription: string;
    content: string;
}
export declare class PostViewModel {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
    extendedLikesInfo: {
        likesCount: number;
        dislikesCount: number;
        myStatus: string;
        newestLikes: NewestLikes[];
    };
    constructor(id: string, title: string, shortDescription: string, content: string, blogId: string, blogName: string, createdAt: string, extendedLikesInfo: {
        likesCount: number;
        dislikesCount: number;
        myStatus: string;
        newestLikes: NewestLikes[];
    });
}

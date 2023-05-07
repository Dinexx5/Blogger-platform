export declare class blogParamModel {
    blogId: number;
}
export declare class BanBlogModel {
    isBanned: boolean;
}
export declare class blogAndPostParamModel {
    blogId: number;
    postId: number;
}
export declare class blogAndUserParamModel {
    blogId: number;
    userId: number;
}
export declare class BlogViewModel {
    id: string;
    name: string;
    description: string;
    isMembership: boolean;
    websiteUrl: string;
    createdAt: string;
    constructor(id: string, name: string, description: string, isMembership: boolean, websiteUrl: string, createdAt: string);
}
export declare class BlogSAViewModel {
    id: string;
    name: string;
    description: string;
    isMembership: boolean;
    websiteUrl: string;
    createdAt: string;
    blogOwnerInfo: object;
    banInfo: object;
    constructor(id: string, name: string, description: string, isMembership: boolean, websiteUrl: string, createdAt: string, blogOwnerInfo: object, banInfo: object);
}
export declare class createBlogModel {
    name: string;
    description: string;
    websiteUrl: string;
}
export declare class updateBlogModel {
    name: string;
    description: string;
    websiteUrl: string;
}

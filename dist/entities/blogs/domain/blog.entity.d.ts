import { BlogOwnerInfo } from './blogOwner.entity';
import { BlogBansInfo } from './blogBansInfo.entity';
export declare class Blog {
    id: number;
    name: string;
    description: string;
    isMembership: boolean;
    websiteUrl: string;
    createdAt: string;
    blogOwnerInfo: BlogOwnerInfo;
    banInfo: BlogBansInfo;
}

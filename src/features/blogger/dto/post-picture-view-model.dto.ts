export class PostPictureViewModel {
  main: PictureViewModel[];
}
export type PictureViewModel = {
  url: string;
  width: number;
  height: number;
  fileSize: number;
};

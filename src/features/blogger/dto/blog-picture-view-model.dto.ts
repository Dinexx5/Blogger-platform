export class BlogPictureViewModel {
  wallpaper:
    | {
        url: string;
        width: number;
        height: number;
        fileSize: number;
      }
    | [];
  main:
    | [
        {
          url: string;
          width: number;
          height: number;
          fileSize: number;
        },
      ]
    | [];
}

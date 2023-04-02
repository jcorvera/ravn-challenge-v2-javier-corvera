export type Src = {
    src: string;
    id?: number;
  };

export type ImagesUploadType = {
    articleUuid: string;
    images: Src[]
}
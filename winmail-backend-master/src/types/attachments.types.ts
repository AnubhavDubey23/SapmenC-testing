export type TAttachments =
  | Express.Multer.File[]
  | { [fieldname: string]: Express.Multer.File[] }
  | undefined;

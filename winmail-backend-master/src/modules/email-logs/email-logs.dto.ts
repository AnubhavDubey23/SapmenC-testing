export type TCreateEmailLogDTO = {
  pixel_id: string;
  templateId: string;
  segmentId: string;
  open_count: number;
  recipient_email: string;
  recipient_name: string;
  tracking_pixel_url: string;
};

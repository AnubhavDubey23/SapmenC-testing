export type UserNodemailerConfigDTO = {
  service: string;
  auth: {
    user: string;
    pass: string;
  };
  reply_to: string;
  display_name: string;
  host: string;
};

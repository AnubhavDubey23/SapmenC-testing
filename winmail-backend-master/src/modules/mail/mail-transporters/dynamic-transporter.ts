import nodemailer from 'nodemailer';

export type TNodeMailerConfig = {
  service: string;
  auth: {
    user: string;
    pass: string;
  };
  reply_to?: string;
  display_name: string;
  host: string;
  port: number;
};

export const handleCreateDynamicTransporter = (config: TNodeMailerConfig) => {
  const transporter = nodemailer.createTransport({
    host: config?.host,
    port: config?.port,
    secure: true,
    service: config?.service,
    auth: {
      user: config.auth.user,
      pass: config.auth.pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  return transporter;
};

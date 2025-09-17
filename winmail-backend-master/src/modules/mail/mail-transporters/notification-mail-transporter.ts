import nodemailer from 'nodemailer';

export const handleCreateSystemNotificationsTransporter = () => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.mailerone.in', // Webmail SMTP server
    port: 465, // For SSL
    secure: true, // True for 465, false for other ports
    auth: {
      user: 'notifications@mailerone.in', // Your webmail address
      pass: 'Mailerone@123', // Your webmail password (or app password)
    },
    tls: {
      rejectUnauthorized: false, // Accept self-signed certificates
    },
  });
  return transporter;
};

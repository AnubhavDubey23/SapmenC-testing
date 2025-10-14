export type TTemplateStats = {
  totalEmails: number;
  openedEmails: number;
  unopenedEmails: number;
  bouncedEmails: number;
  recievedEmails: number;
};

export type TTemplate = {
  _id: string;
  createdAt: any;
  updatedAt: any;
  name: string;
  description: string;
  email_data: any;
  subject: string;
  created_by: any;
  updated_by: any;
  is_active: boolean;
  is_triggered: boolean;
  stats: TTemplateStats;
  segments_used: any;
};

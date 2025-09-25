import { Connection, ObjectId } from 'mongoose';
import { connectDB } from '../../config/db';
import UserRepository from '../../modules/user/user.repository';
import TemplateRepository from '../../modules/template/template.repository';
import EMAIL_DATA from './email_data.json';

const getAllUsersIds = async () => {
  try {
    const users: any = await UserRepository.findAllUsers();
    return users.map((user: any) => user._id);
  } catch (err: any) {
    console.log(err);
    return err;
  }
};

const getSingleUserId = (arr: any) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export type Tsegment = {
  name: string;
  description: string;
  email_data: any;
  created_by: ObjectId | string;
  subject: string;
};

export const seedTemplates = async () => {
  try {
    const users = await getAllUsersIds();

    const templates: Tsegment[] = [
      {
        name: 'Work',
        description: 'Work related emails',
        email_data: EMAIL_DATA,
        created_by: getSingleUserId(users),
        subject: 'Work related emails',
      },
      {
        name: 'Personal',
        description: 'Personal emails',
        email_data: EMAIL_DATA,
        created_by: getSingleUserId(users),
        subject: 'Personal emails',
      },
    ];

    for (const template of templates) {
      await TemplateRepository.createTemplate(template, template.created_by);
    }
  } catch (err: any) {
    console.error(err.message);
  }
};

export const seedTemplatesData = async () => {
  const conn: void | Connection = await connectDB({
    explicitClose: true,
  });

  if (conn) {
    try {
      await seedTemplates();
      console.log('Templates data seeded successfully');
    } catch (err: any) {
      console.error(err.message);
    } finally {
      conn.close();
      console.log('Connection closed');
    }
  }
};

seedTemplatesData();

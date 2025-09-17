import { Connection, ObjectId } from 'mongoose';
import { connectDB } from '../../config/db';
import UserRepository from '../../modules/user/user.repository';
// import * as segmentRepository from '../../modules/segment/segment.repository';
import SegmentRepository from '../../modules/segment/segment.repository';

// export type Tsegment = {
//   name: string;
//   description: string;
//   subject: string;
//   recipients: {
//     email: string;
//     name: string;
//   }[];
//   created_by: ObjectId | string;
// };

// const getAllUsersIds = async () => {
//   try {
//     const users: any = await UserRepository.findAllUsers();
//     return users.map((user: any) => user._id);
//   } catch (err: any) {
//     console.log(err);
//     return err;
//   }
// };

// const getSingleUserId = (arr: any) => {
//   return arr[Math.floor(Math.random() * arr.length)];
// };

// export const seedsegments = async () => {
//   try {
//     const users = await getAllUsersIds();

//     const segments: Tsegment[] = [
//       {
//         name: 'Work',
//         description: 'Work related emails',
//         subject: 'Work related emails',
//         recipients: [
//           {
//             email: 'prakharkapoorkp99@gmail.com',
//             name: 'Prakhar Kapoor',
//           },
//         ],
//         created_by: getSingleUserId(users),
//       },
//       {
//         name: 'Personal',
//         description: 'Personal emails',
//         subject: 'Personal emails',
//         recipients: [
//           {
//             email: 'aishwaryasunbeam123@gmail.com',
//             name: 'Aishwarya Jaiswal',
//           },
//         ],
//         created_by: getSingleUserId(users),
//       },
//     ];

//     for (const segment of segments) {
//       await segmentRepository.createsegment(segment, segment.created_by);
//     }
//   } catch (err: any) {
//     console.error(err.message);
//   }
// };

// export const seedsegmentsData = async () => {
//   const conn: void | Connection = await connectDB({
//     explicitClose: true,
//   });
//   await seedsegments();
//   if (conn instanceof Connection) {
//     conn.close();
//   }
//   console.log('segments seeded successfully');
// };

// seedsegmentsData();

type TSeedSegment = {
  name: string;
  description: string;
  recipients: { email: string; name: string }[];
  created_by: string;
};

const getAllUsersIds = async () => {
  const users: any = await UserRepository.findAllUsers();
  return users.map((u: any) => String(u._id));
};

const getSingleUserId = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

export const seedsegments = async () => {
  const users = await getAllUsersIds();

  const segments: TSeedSegment[] = [
    {
      name: 'Work',
      description: 'Work related emails',
      recipients: [
        { email: 'prakharkapoorkp99@gmail.com', name: 'Prakhar Kapoor' },
      ],
      created_by: getSingleUserId(users),
    },
    {
      name: 'Personal',
      description: 'Personal emails',
      recipients: [
        { email: 'aishwaryasunbeam123@gmail.com', name: 'Aishwarya Jaiswal' },
      ],
      created_by: getSingleUserId(users),
    },
  ];

  for (const segment of segments) {
    // 1) create an empty segment
    const seg = await SegmentRepository.createSegment(
      {
        name: segment.name,
        description: segment.description,
      },
      segment.created_by
    );

    // 2) add recipients via updateSegment (will create contacts + link _ids)
    await SegmentRepository.updateSegment(
      String(seg._id),
      { recipients: segment.recipients },
      segment.created_by
    );
    
  }
};

export const seedsegmentsData = async () => {
  const conn: void | Connection = await connectDB({ explicitClose: true });
  await seedsegments();
  if (conn instanceof Connection) conn.close();
  console.log('segments seeded successfully');
};

seedsegmentsData();
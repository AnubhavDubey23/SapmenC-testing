import { Connection } from 'mongoose';
import { connectDB } from '../../config/db';
import dotenv from 'dotenv';

dotenv.config();

const handleResetDb = async () => {
  try {
    const conn: void | Connection = await connectDB({
      explicitClose: true,
    });

    if (!conn) {
      throw new Error('Connection to database failed');
    }

    console.log('Dropping database...');
    // find all the collections in the database
    const collections = await conn.db.listCollections().toArray();

    // drop all the collections
    for (const collection of collections) {
      console.log(`Dropping collection: ${collection.name}`);
      await conn.db.dropCollection(collection.name);
    }

    console.log('Database dropped');

    if (conn instanceof Connection) {
      conn.close();
    }

    console.log('Database reset successful');
  } catch (err) {
    console.error('Error resetting database: ', err);
  }
};

handleResetDb();

module.exports = {
  async up(db, client) {
    await db.collection('users').updateMany(
      {},
      {
        $set: {
          otp: null, // Default value for 'otp'
          is_verified: false, // Default value for 'is_verified'
        },
      }
    );
  },

  async down(db, client) {
    await db.collection('users').updateMany(
      {},
      {
        $unset: {
          otp: '', // Remove 'otp' field
          is_verified: '', // Remove 'is_verified' field
        },
      }
    );
  },
};

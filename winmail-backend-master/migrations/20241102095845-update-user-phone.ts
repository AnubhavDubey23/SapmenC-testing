module.exports = {
  async up(db, client) {
    await db.collection('users').updateMany(
      {},
      {
        $set: {
          phone: null,
        },
      }
    );
  },

  async down(db, client) {
    await db.collection('users').updateMany(
      {},
      {
        $unset: {
          phone: '',
        },
      }
    );
  },
};

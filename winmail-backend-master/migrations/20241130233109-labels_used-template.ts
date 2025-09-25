module.exports = {
  async up(db, client) {
    await db.collection('templates').updateMany(
      {},
      {
        $set: {
          segments_used: null,
        },
      }
    );
  },

  async down(db, client) {
    await db.collection('templates').updateMany(
      {},
      {
        $unset: {
          segments_used: null,
        },
      }
    );
  },
};

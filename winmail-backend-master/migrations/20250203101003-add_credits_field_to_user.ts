module.exports = {
  async up(db, client) {
    await db.collection('users').updateMany({}, { $set: { credits: 0 } });
  },

  async down(db, client) {
    await db.collection('users').updateMany({}, { $unset: { credits: '' } });
  },
};

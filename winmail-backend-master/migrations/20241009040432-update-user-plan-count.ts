module.exports = {
  async up(db, client) {
    await db.collection('users').updateMany(
      {},
      {
        $set: {
          total_segment_count: 0,
          total_template_count: 0,
          total_triggered_email_count: 0,
          total_imported_contacts_count: 0,
        },
      }
    );
  },

  async down(db, client) {
    await db.collection('users').updateMany(
      {},
      {
        $unset: {
          total_segment_count: '',
          total_template_count: '',
          total_triggered_email_count: '',
          total_imported_contacts_count: '',
        },
      }
    );
  },
};

import command from './commandRollback';
import Context from './Context';

test('command_rollback', async () => {
  const context = Context();
  context.$id = () => 'commandId';
  const args = { username: 'commandUser' };

  const { client, db } = await context.$mongo;
  try {
    try {
      await db.collection('rollback_users').drop();
    } catch (error) {
      if (error.codeName !== 'NamespaceNotFound') throw error;
    }

    try {
      await db.collection('rollback_usersEvents').drop();
    } catch (error) {
      if (error.codeName !== 'NamespaceNotFound') throw error;
    }

    await db.createCollection('rollback_users');
    await db.createCollection('rollback_usersEvents');
    await command.exec(context, args).catch(async () => {
      const user = await db.collection('rollback_users').findOne({ _id: 'commandId' });
      const userEvents = await db.collection('rollback_usersEvents').find().toArray();
      expect(user).toBeNull();
      expect(userEvents.length).toBe(0);
    });
  } finally {
    client.close();
  }
});

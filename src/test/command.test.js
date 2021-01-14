import command from './command';
import Context from './Context';

test('command', async () => {
  const context = Context();
  context.$id = () => 'commandId';
  const args = { username: 'commandUser' };

  const { client, db } = await context.$mongo;
  try {
    try {
      await db.collection('command_users').drop();
    } catch (error) {
      if (error.codeName !== 'NamespaceNotFound') throw error;
    }
    await db.createCollection('command_users');
    await command.exec(context, args);
    const user = await db.collection('command_users').findOne({ _id: 'commandId' });
    expect(user.username).toBe('commandUser');
  } finally {
    client.close();
  }
});

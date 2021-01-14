import command from './commandUsingSession';
import Context from './Context';

test('session_command', async () => {
  const context = Context();
  context.$id = () => 'commandId';
  const args = { username: 'commandUser' };

  const { client, db } = await context.$mongo;
  try {
    try {
      await db.collection('session_users').drop();
    } catch (error) {
      if (error.codeName !== 'NamespaceNotFound') throw error;
    }

    try {
      await db.collection('session_usersEvents').drop();
    } catch (error) {
      if (error.codeName !== 'NamespaceNotFound') throw error;
    }

    await db.createCollection('session_users');
    await db.createCollection('session_usersEvents');
    await command.exec(context, args);
    const user = await db.collection('session_users').findOne({ _id: 'commandId' });
    const userEvents = await db.collection('session_usersEvents').find().toArray();
    expect(user.username).toBe('commandUser');
    expect(userEvents.length).toBe(1);
  } finally {
    client.close();
  }
});

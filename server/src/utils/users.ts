const users: any[] = [];

// Join user to chat
export function userJoin(id: number, username: string, room: string): any {
  const user: any = { id, username, room };

  users.push(user);

  return user;
}

// Get the current user
export function getCurrentUser(id: number) {
  return users.find((user: any) => user.id === id);
}

// User leave chat
export function userLeave(id: number) {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    // Remove the user from users array and return the removed user
    return users.splice(index, 1)[0];
  }
}

// Get room users
export function getRoomUsers(room: string) {
  return users.filter((user) => user.room === room);
}

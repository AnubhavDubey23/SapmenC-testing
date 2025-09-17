const INVITEES: string[] = ['keyurshinde511@gmail.com'];

export function isInvitee(email: string) {
  if (INVITEES.includes(email)) {
    return true;
  }

  return false;
}

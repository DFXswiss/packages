import { SupportMessage, SupportMessageStatus } from './definitions/support';

/** Höchste bestätigte Nachrichten-Kennung, oder undefined wenn es keine gibt.
 *  Optimistische Nachrichten tragen negative Platzhalter und zählen nicht. */
export function lastSettledMessageId(messages: SupportMessage[]): number | undefined {
  let highest: number | undefined;

  for (const message of messages) {
    if (message.id > 0 && (highest === undefined || message.id > highest)) {
      highest = message.id;
    }
  }

  return highest;
}

/** Fügt eingehende Nachrichten hinzu, die noch nicht vorhanden sind.
 *  Gibt IMMER ein neues Array zurück und verändert das übergebene nie. */
export function mergeMessages(current: SupportMessage[], incoming: SupportMessage[]): SupportMessage[] {
  return [...current, ...incoming.filter((m) => !current.some((c) => c.id === m.id))];
}

/** Ersetzt die optimistische Nachricht mit der Kennung `tempId`.
 *  Mit `settled` -> Status Received und Serverdaten; ohne -> Status Failed.
 *  Findet die Nachricht über ihre Kennung, nie über einen Index.
 *  Existiert bereits eine andere Nachricht mit `settled.id` (z. B. vom Sync),
 *  wird der optimistische Eintrag entfernt statt ersetzt.
 *  Gibt IMMER ein neues Array zurück; unbekannte Kennung -> unverändertes neues Array. */
export function settleMessage(messages: SupportMessage[], tempId: number, settled?: SupportMessage): SupportMessage[] {
  if (settled && messages.some((m) => m.id !== tempId && m.id === settled.id)) {
    return messages.filter((m) => m.id !== tempId);
  }

  return messages.map((message) => {
    if (message.id !== tempId) return message;

    return {
      ...message,
      ...settled,
      status: settled ? SupportMessageStatus.RECEIVED : SupportMessageStatus.FAILED,
    };
  });
}

import { SupportIssue, SupportMessage, SupportMessageStatus } from './definitions/support';

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

/** Wendet eine eingehende SupportIssue-Antwort auf den lokalen State an.
 *  Kein offenes Ticket → incoming übernehmen.
 *  Anderes Ticket (uid) → prev unverändert lassen (veraltete Sync-Antwort verwerfen).
 *  Selbes Ticket → Nachrichten mergen, übrige prev-Felder behalten. */
export function applySupportIssueUpdate(prev: SupportIssue | undefined, incoming: SupportIssue): SupportIssue {
  if (!prev) return incoming;
  if (prev.uid !== incoming.uid) return prev;
  return {
    ...prev,
    messages: mergeMessages(prev.messages, incoming.messages),
  };
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

export type PrepareRetryResult = {
  messages: SupportMessage[];
  /** Snapshot of the failed message to re-send; absent means no-op. */
  payload?: SupportMessage;
};

/** Claims a Failed message for retry: sets status to Sent in place.
 *  Unknown ids and non-Failed statuses leave the list effectively unchanged (new array, no payload). */
export function prepareRetry(messages: SupportMessage[], messageId: number): PrepareRetryResult {
  const target = messages.find((m) => m.id === messageId);
  if (!target || target.status !== SupportMessageStatus.FAILED) {
    return { messages: [...messages] };
  }

  return {
    messages: messages.map((m) => (m.id === messageId ? { ...m, status: SupportMessageStatus.SENT } : m)),
    payload: target,
  };
}

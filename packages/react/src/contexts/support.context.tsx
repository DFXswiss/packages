import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Utils } from '../utils';
import {
  SupportIssue,
  CreateSupportIssue,
  SupportMessage,
  SupportMessageStatus,
  DataFile,
} from '../definitions/support';
import { useSupportChat } from '../hooks/support.hook';
import { lastSettledMessageId, mergeMessages, settleMessage as settleMessageInList } from '../support-messages';

interface SupportChatInterface {
  tickets: SupportIssue[];
  supportIssue?: SupportIssue;
  isLoading: boolean;
  isError?: string;
  loadTickets: () => Promise<void>;
  loadSupportIssue: (uid: string) => Promise<void>;
  createSupportIssue: (request: CreateSupportIssue, file?: File) => Promise<string>;
  submitMessage: (message?: string, files?: File[], replyToMessage?: SupportMessage) => Promise<void>;
  handleEmojiClick: (messageId: number, emoji: string) => void;
  loadFileData: (messageId: number) => Promise<void>;
  setSync: (sync: boolean) => void;
}

const SupportChatContext = createContext<SupportChatInterface>(undefined as any);

export const useSupportChatContext = () => useContext(SupportChatContext);

export function SupportChatContextProvider(props: PropsWithChildren): JSX.Element {
  const { getIssues, getIssue, createIssue, createMessage, fetchFileData } = useSupportChat();

  const currUnsettledMessageId = useRef(0);
  const supportIssueRef = useRef<SupportIssue>();
  const isLoadingRef = useRef(false);
  // Ref (not state): the interval callback closes once on [sync]; state would go stale and
  // the overlap guard would never see isSyncing flip to true between ticks.
  const isSyncingRef = useRef(false);

  const [tickets, setTickets] = useState<SupportIssue[]>([]);
  const [supportIssue, setSupportIssue] = useState<SupportIssue>();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<string>();
  const [sync, setSync] = useState(false);

  useEffect(() => {
    supportIssueRef.current = supportIssue;
  }, [supportIssue]);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    if (!sync) return;
    const handle = setInterval(() => void syncSupportIssue(), 5000);
    return () => clearInterval(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sync]);

  async function loadTickets(): Promise<void> {
    setIsLoading(true);
    setIsError(undefined);

    return getIssues()
      .then((tickets) => setTickets(tickets))
      .finally(() => setIsLoading(false));
  }

  async function loadSupportIssue(uid: string): Promise<void> {
    if (!uid || uid === supportIssue?.uid) return;

    setSupportIssue(undefined);
    setIsLoading(true);
    setIsError(undefined);

    return getIssue(uid)
      .then((response) => setSupportIssue({ ...response }))
      .finally(() => setIsLoading(false));
  }

  async function syncSupportIssue(): Promise<void> {
    const issue = supportIssueRef.current;
    if (!issue || isLoadingRef.current || isSyncingRef.current) return;

    const fromMessageId = lastSettledMessageId(issue.messages);

    isSyncingRef.current = true;
    setIsError(undefined);
    // undefined -> SupportUrl.getIssue omits the query (full history), not fromMessageId=undefined
    return getIssue(issue.uid, fromMessageId)
      .then((response) => updateSupportIssue(response))
      .catch(() => setIsError('Error while syncing messages'))
      .finally(() => {
        isSyncingRef.current = false;
      });
  }

  async function createSupportIssue(request: CreateSupportIssue, file?: File): Promise<string> {
    const dataFile = file && (await mapFileToDataFile(file));
    const messageId = getNextUnsettledMessageId();

    setSupportIssue((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        messages: [
          ...prev.messages,
          {
            id: messageId,
            created: new Date(),
            message: request.message,
            fileName: file?.name,
            file: dataFile,
            status: SupportMessageStatus.SENT,
          },
        ],
      };
    });

    try {
      const issue = await createIssue(request);
      settleMessage(messageId, issue.messages[issue.messages.length - 1]);
      updateSupportIssue(issue);
      return issue.uid;
    } catch (error) {
      settleMessage(messageId);
      throw error;
    }
  }

  async function submitMessage(message?: string, files?: File[], replyToMessage?: SupportMessage): Promise<void> {
    if (!supportIssue) return;

    const hasText = message && message.trim() !== '';
    const hasFiles = files && files.length > 0;

    if (!hasText && !hasFiles) return;

    const issueUid = supportIssue.uid;
    const modFiles = files?.length !== 1 && hasText ? [...(files ?? []), undefined] : (files ?? []);
    modFiles.forEach(async (file: File | undefined, index) => {
      const dataFile = file && (await mapFileToDataFile(file));
      const messageId = getNextUnsettledMessageId();

      const newMessage: SupportMessage = {
        id: messageId,
        message: index === modFiles.length - 1 && hasText ? message : undefined,
        file: dataFile,
        fileName: file?.name,
        created: new Date(),
        status: SupportMessageStatus.SENT,
        replyTo: index === 0 ? replyToMessage?.id : undefined,
      };

      setSupportIssue((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: [...prev.messages, newMessage],
        };
      });

      createMessage(issueUid, {
        message: newMessage.message,
        file: dataFile?.file,
        fileName: newMessage.fileName,
      })
        .then((response) => settleMessage(messageId, response))
        .catch(() => settleMessage(messageId));
    });
  }

  async function loadFileData(messageId: number): Promise<void> {
    const message = supportIssue?.messages.find((m) => m.id === messageId);
    if (!supportIssue || !message?.fileName) throw new Error('Failed to load file data');

    return fetchFileData(supportIssue.uid, message.id).then((blobContent) => {
      const byteArray = new Uint8Array(blobContent.data.data);
      const blob = new Blob([byteArray], { type: blobContent.contentType });

      const newFile = {
        file: blobContent.data.data,
        type: blobContent.contentType,
        size: blob.size,
        url: URL.createObjectURL(blob),
      };

      setSupportIssue((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: prev.messages.map((m) => (m.id === messageId ? { ...m, file: newFile } : m)),
        };
      });
    });
  }

  function handleEmojiClick(messageId: number, emoji: string, user = 'Customer') {
    setSupportIssue((prev) => {
      if (!prev) return prev;

      const messageIndex = prev.messages.findIndex((m) => m.id === messageId);
      if (messageIndex === -1) return prev;

      const message = prev.messages[messageIndex];
      const reactions = message.reactions ? [...message.reactions] : [];
      const reactionIndex = reactions.findIndex((r) => r.emoji === emoji);

      let nextReactions = reactions;
      if (reactionIndex === -1) {
        nextReactions = [...reactions, { emoji, users: [user] }];
      } else {
        const reaction = reactions[reactionIndex];
        const users = [...reaction.users];
        const userIndex = users.indexOf(user);
        if (userIndex === -1) {
          nextReactions = [
            ...reactions.slice(0, reactionIndex),
            { ...reaction, users: [...users, user] },
            ...reactions.slice(reactionIndex + 1),
          ];
        } else {
          const nextUsers = users.filter((_, i) => i !== userIndex);
          if (nextUsers.length === 0) {
            nextReactions = reactions.filter((_, i) => i !== reactionIndex);
          } else {
            nextReactions = [
              ...reactions.slice(0, reactionIndex),
              { ...reaction, users: nextUsers },
              ...reactions.slice(reactionIndex + 1),
            ];
          }
        }
      }

      return {
        ...prev,
        messages: prev.messages.map((m, i) => (i === messageIndex ? { ...m, reactions: nextReactions } : m)),
      };
    });

    // TODO (later): Update message on server side. Feature not yet available.
  }

  const context = useMemo(
    () => ({
      tickets,
      supportIssue,
      isLoading,
      isError,
      loadTickets,
      loadSupportIssue,
      createSupportIssue,
      submitMessage,
      handleEmojiClick,
      loadFileData,
      setSync,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tickets, supportIssue, isLoading, isError],
  );

  // --- HELPER FUNCTIONS --- //

  function updateSupportIssue(newState: SupportIssue) {
    setSupportIssue((prev) => {
      if (!prev) return newState;
      return {
        ...prev,
        messages: mergeMessages(prev.messages, newState.messages),
      };
    });
  }

  function settleMessage(messageId: number, newMessage?: SupportMessage) {
    setSupportIssue((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        messages: settleMessageInList(prev.messages, messageId, newMessage),
      };
    });
  }

  async function mapFileToDataFile(file: File): Promise<DataFile | undefined> {
    const base64File = await Utils.toBase64(file);
    if (!base64File) return;

    return {
      file: base64File,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
    };
  }

  function getNextUnsettledMessageId(): number {
    return --currUnsettledMessageId.current;
  }

  return <SupportChatContext.Provider value={context}>{props.children}</SupportChatContext.Provider>;
}

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

interface SupportChatInterface {
  supportIssue?: SupportIssue;
  isLoading: boolean;
  isError?: string;
  loadSupportIssue: (id: number) => Promise<void>;
  createSupportIssue: (request: CreateSupportIssue, file?: File) => Promise<number>;
  submitMessage: (message?: string, files?: File[], replyToMessage?: SupportMessage) => Promise<void>;
  handleEmojiClick: (messageId: number, emoji: string) => void;
  loadFileData: (messageId: number) => Promise<void>;
  setSync: (sync: boolean) => void;
}

const SupportChatContext = createContext<SupportChatInterface>(undefined as any);

export const useSupportChatContext = () => useContext(SupportChatContext);

export function SupportChatContextProvider(props: PropsWithChildren): JSX.Element {
  const { getIssue, createIssue, createMessage, fetchFileData } = useSupportChat();

  const currUnsettledMessageId = useRef(0);

  const [supportIssue, setSupportIssue] = useState<SupportIssue>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isError, setIsError] = useState<string>();
  const [sync, setSync] = useState(false);

  useEffect(() => {
    const interval = setTimeout(() => sync && syncSupportIssue(), 5000);
    return () => clearInterval(interval);
  }, [supportIssue, sync]);

  async function loadSupportIssue(id: number): Promise<void> {
    if (!id || id === supportIssue?.id) return;

    setSupportIssue(undefined);
    setIsLoading(true);
    setIsError(undefined);

    getIssue(id)
      .then((response) => setSupportIssue(response))
      .catch(() => setIsError('Error while fetching support issue'))
      .finally(() => setIsLoading(false));
  }

  async function syncSupportIssue(): Promise<void> {
    if (!supportIssue || isLoading || isSyncing) return;

    setIsSyncing(true);
    const fromMessageId = supportIssue.messages[supportIssue.messages.length - 1].id;
    getIssue(supportIssue.id, fromMessageId)
      .then((response) => updateSupportIssue(response))
      .catch(() => setIsError('Error while fetching support messages'))
      .finally(() => setIsSyncing(false));
  }

  async function createSupportIssue(request: CreateSupportIssue, file?: File): Promise<number> {
    const dataFile = file && (await mapFileToDataFile(file));
    const messageId = getNextUnsettledMessageId();

    setSupportIssue((supportIssue) => {
      if (!supportIssue) return supportIssue;
      supportIssue.messages.push({
        id: messageId,
        created: new Date(),
        message: request.message,
        fileName: file?.name,
        file: dataFile,
        status: SupportMessageStatus.SENT,
      });

      return { ...supportIssue };
    });

    try {
      const issue = await createIssue(request);
      settleMessage(messageId, issue.messages[issue.messages.length - 1]);
      updateSupportIssue(issue);
      return issue.id;
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

    const modFiles = files?.length !== 1 && hasText ? [...(files ?? []), undefined] : files ?? [];
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

      setSupportIssue((supportIssue) => {
        if (!supportIssue) return supportIssue;
        supportIssue.messages.push(newMessage);
        return { ...supportIssue };
      });

      createMessage(supportIssue.id, {
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

    return fetchFileData(supportIssue.id, message.id).then((blobContent) => {
      const byteArray = new Uint8Array(blobContent.data.data);
      const blob = new Blob([byteArray], { type: blobContent.contentType });

      const newFile = {
        file: blobContent.data.data,
        type: blobContent.contentType,
        size: blob.size,
        url: URL.createObjectURL(blob),
      };

      setSupportIssue((supportIssue) => {
        if (!supportIssue) return supportIssue;
        if (message) message.file = newFile;
        return { ...supportIssue };
      });
    });
  }

  function handleEmojiClick(messageId: number, emoji: string, user = 'Customer') {
    if (!supportIssue) return;

    const messageIndex = supportIssue.messages.findIndex((m) => m.id === messageId);
    if (messageIndex === -1) return;

    const message = supportIssue.messages[messageIndex];
    if (!message.reactions) message.reactions = [];
    const reactionIndex = message.reactions?.findIndex((r) => r.emoji === emoji);
    if (reactionIndex === -1) {
      message.reactions.push({ emoji, users: [user] });
    } else {
      const userIndex = message.reactions[reactionIndex].users.indexOf(user);
      if (userIndex === -1) {
        message.reactions[reactionIndex].users.push(user);
      } else {
        message.reactions[reactionIndex].users.splice(userIndex, 1);
        if (message.reactions[reactionIndex].users.length === 0) {
          message.reactions.splice(reactionIndex, 1);
        }
      }
    }

    setSupportIssue((supportIssue) => {
      if (!supportIssue) return supportIssue;
      supportIssue.messages[messageIndex] = message;
      return { ...supportIssue };
    });

    // TODO (later): Update message on server side. Feature not yet available.
  }

  const context = useMemo(
    () => ({
      supportIssue,
      isLoading,
      isError,
      loadSupportIssue,
      createSupportIssue,
      submitMessage,
      handleEmojiClick,
      loadFileData,
      setSync,
    }),
    [
      supportIssue,
      isLoading,
      isError,
      loadSupportIssue,
      createSupportIssue,
      submitMessage,
      handleEmojiClick,
      loadFileData,
      setSync,
    ],
  );

  // --- HELPER FUNCTIONS --- //

  function updateSupportIssue(newState: SupportIssue) {
    setSupportIssue((supportIssue) => {
      if (!supportIssue) return newState;
      supportIssue.messages = [
        ...supportIssue.messages,
        ...newState.messages.filter((m) => !supportIssue.messages.some((sm) => sm.id === m.id)),
      ];
      return { ...supportIssue };
    });
  }

  function settleMessage(messageId: number, newMessage?: SupportMessage) {
    const idx = supportIssue?.messages.findIndex((m) => m.id === messageId);
    if (!supportIssue || !idx || idx === -1) return;

    const settledMessage = supportIssue.messages[idx];

    setSupportIssue((supportIssue) => {
      if (!supportIssue) return supportIssue;
      supportIssue.messages[idx] = {
        ...settledMessage,
        ...newMessage,
        status: newMessage ? SupportMessageStatus.RECEIVED : SupportMessageStatus.FAILED,
      };
      return { ...supportIssue };
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

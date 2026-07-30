import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { JobStatus } from '../definitions/job';
import { useApi } from '../hooks/api.hook';

export interface JobStatusMessage {
  uid: string;
  status: JobStatus;
}

export interface JobContextInterface {
  subscribe: (uid: string, onStatus: (message: JobStatusMessage) => void) => void;
  unsubscribe: (uid: string) => void;
}

const JobContext = createContext<JobContextInterface>(undefined as any);

export function useJobContext(): JobContextInterface {
  return useContext(JobContext);
}

// Reconnect backoff: 1s base, doubles each attempt, max delay 30s, give up after 5 attempts until next subscribe.
const RECONNECT_BASE_MS = 1000;
const RECONNECT_MAX_DELAY_MS = 30000;
const RECONNECT_MAX_ATTEMPTS = 5;

export function JobContextProvider(props: PropsWithChildren): JSX.Element {
  const { defaultUrl } = useApi();
  const subscribersRef = useRef(new Map<string, (message: JobStatusMessage) => void>());
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const reconnectAttemptRef = useRef(0);
  const intentionalCloseRef = useRef(false);

  const clearReconnectTimer = useCallback(() => {
    if (reconnectTimerRef.current !== undefined) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = undefined;
    }
  }, []);

  const detachSocketHandlers = useCallback((socket: WebSocket) => {
    socket.onopen = null;
    socket.onmessage = null;
    socket.onclose = null;
    socket.onerror = null;
  }, []);

  const closeSocket = useCallback(() => {
    const socket = socketRef.current;
    if (socket === null) {
      return;
    }
    intentionalCloseRef.current = true;
    detachSocketHandlers(socket);
    socket.close();
    socketRef.current = null;
  }, [detachSocketHandlers]);

  const buildSocketUrl = useCallback((): string => {
    const uids = Array.from(subscribersRef.current.keys());
    const wsBase = defaultUrl.replace(/^http/, 'ws');
    const query = uids.map((uid) => `uid=${encodeURIComponent(uid)}`).join('&');
    return `${wsBase}/job?${query}`;
  }, [defaultUrl]);

  const connect = useCallback(() => {
    if (subscribersRef.current.size === 0) {
      return;
    }

    clearReconnectTimer();
    closeSocket();

    intentionalCloseRef.current = false;
    const socket = new WebSocket(buildSocketUrl());
    socketRef.current = socket;

    socket.onopen = () => {
      reconnectAttemptRef.current = 0;
    };

    socket.onmessage = (event: MessageEvent) => {
      let message: JobStatusMessage;
      try {
        message = JSON.parse(String(event.data)) as JobStatusMessage;
      } catch {
        // Malformed socket payloads are ignored; they must not crash the app.
        return;
      }

      const onStatus = subscribersRef.current.get(message.uid);
      if (onStatus) {
        onStatus(message);
      }
    };

    socket.onclose = () => {
      if (socketRef.current === socket) {
        socketRef.current = null;
      }
      if (intentionalCloseRef.current || subscribersRef.current.size === 0) {
        return;
      }
      if (reconnectAttemptRef.current >= RECONNECT_MAX_ATTEMPTS) {
        return;
      }

      const delay = Math.min(RECONNECT_BASE_MS * Math.pow(2, reconnectAttemptRef.current), RECONNECT_MAX_DELAY_MS);
      reconnectAttemptRef.current += 1;
      reconnectTimerRef.current = setTimeout(() => {
        connect();
      }, delay);
    };

    socket.onerror = () => {
      socket.close();
    };
  }, [buildSocketUrl, clearReconnectTimer, closeSocket]);

  const subscribe = useCallback(
    (uid: string, onStatus: (message: JobStatusMessage) => void) => {
      subscribersRef.current.set(uid, onStatus);
      reconnectAttemptRef.current = 0;
      connect();
    },
    [connect],
  );

  const unsubscribe = useCallback(
    (uid: string) => {
      subscribersRef.current.delete(uid);
      if (subscribersRef.current.size === 0) {
        clearReconnectTimer();
        closeSocket();
        return;
      }
      connect();
    },
    [clearReconnectTimer, closeSocket, connect],
  );

  useEffect(() => {
    return () => {
      clearReconnectTimer();
      const socket = socketRef.current;
      if (socket !== null) {
        intentionalCloseRef.current = true;
        detachSocketHandlers(socket);
        socket.close();
        socketRef.current = null;
      }
      subscribersRef.current.clear();
    };
  }, [clearReconnectTimer, detachSocketHandlers]);

  const context = useMemo(
    () => ({
      subscribe,
      unsubscribe,
    }),
    [subscribe, unsubscribe],
  );

  return <JobContext.Provider value={context}>{props.children}</JobContext.Provider>;
}

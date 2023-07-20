import { useCallback, useEffect, useRef } from "react";
import { IUseLocalstorageManager } from "./use-localstorage-manager.interface";

export function useLocalstorageManager(props?: IUseLocalstorageManager.Props) {
  const {
    onSubscribe,
    onUnsubscribe,
  } = props ?? {};
  const savedSubscribers = useRef<Map<string, IUseLocalstorageManager.Subscriber>>(new Map()); // `${key}`
  const subscribeKeys = useRef<Set<string>>(new Set());

  /**
   * 본 함수를 호출하기 전에 먼저 saveSubscribeInfo 함수를 호출하여 구독이 되었을 때의 설정 정보를 미리 셋팅해야 합니다.
   */
  function subscribe(key: string) {
    if (typeof onSubscribe === 'function') {
      if (!subscribeKeys.current.has(key)) {
        onSubscribe(key);
      }
    }
    subscribeKeys.current.add(key);
  }

  function unsubscribe(key: string) {
    if (typeof onUnsubscribe === 'function') {
      if (subscribeKeys.current.has(key)) {
        onUnsubscribe(key);
      }
    }
    subscribeKeys.current.delete(key);
  }

  /**
   * 이 함수는 subscribe 함수보다 먼저 호출되어야 합니다.
   */
  function saveSubscribeInfo(subscriber: IUseLocalstorageManager.Subscriber) {
    savedSubscribers.current.set(subscriber.key, subscriber);
  }

  const onStorageCallback = useCallback((event: StorageEvent) => {
    const { key, newValue } = event;
    if (subscribeKeys.current.has(key ?? '')) {
      const savedSubscriber = savedSubscribers.current.get(key ?? '');
      savedSubscriber?.callback(newValue);
    }
  }, []);

  function setItem(info: IUseLocalstorageManager.SetInfo) {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(info.key, info.value);
      if (subscribeKeys.current.has(info.key) && info.isEmitMeToo === true) {
        const savedSubscriber = savedSubscribers.current.get(info.key);
        savedSubscriber?.callback(info.value);
      }
    }
  }

  function getItem(key: string) {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem(key);
    } else {
      return null;
    }
  }

  function removeItem(key: string) {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key);
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', onStorageCallback);
      window.addEventListener('storage', onStorageCallback);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', onStorageCallback);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    saveSubscribeInfo,
    subscribe,
    unsubscribe,
    setItem,
    getItem,
    removeItem,
  };
}
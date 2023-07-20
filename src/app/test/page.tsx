"use client"
import { useLocalstorageManager } from "@/hooks/use-localstorage-manager/use-localstorage-manager.hook";
import { useEffect, useState } from "react";

export default function Page() {
  const [timestamp, setTimestamp] = useState<number>(0);
  const localstorageManager = useLocalstorageManager({
    onSubscribe(key) {
      console.log('@onSubscribe.key', key);
    },
    onUnsubscribe(key) {
      console.log('@onUnsubscribe.key', key);
    },
  });  

  localstorageManager.saveSubscribeInfo({
    key: 'my-key',
    callback(data) {
      console.log('@timestamp', timestamp);
      console.log('@data', data);
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(new Date().getTime());
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <button onClick={() => localstorageManager.setItem({ key: 'my-key', value: new Date().getTime().toString(), isEmitMeToo: true })}>값 변경</button>
      <button onClick={() => { localstorageManager.subscribe('my-key') }}>구독 시작하기</button>
      <button onClick={() => { localstorageManager.unsubscribe('my-key') }}>구독 해제하기</button>
    </>
  );
}

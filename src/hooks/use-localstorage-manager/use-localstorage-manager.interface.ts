export declare namespace IUseLocalstorageManager {
  export interface Subscriber {
    key: string;
    callback: (data: string | null) => void;
  }

  export interface SetInfo {
    key: string;
    value: string;
    isEmitMeToo?: boolean;
  }

  export interface Props {
    onSubscribe?: (key: string) => void;
    onUnsubscribe?: (key: string) => void;
  }
}
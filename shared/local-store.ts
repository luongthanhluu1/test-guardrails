import create from "zustand";
import produce from "immer";

interface Fnc {
  (draft: any): void;
}

export const createStore = (config: any) =>
  create<any>((set, get, api) =>
    config((fn: () => void) => set(produce(fn)), get, api)
  );

export const createLocalStore = (initialData: any, extend: any) => {
  return createStore((set: Fnc) => ({
    data: null,
    item: null,
    action: "update",
    load: (data: any) =>
      set((draft: any) => {
        draft.data = data;
      }),
    inserOrUpdate: (item: any) =>
      set((draft: any) => {
        if (draft.action === "add") {
          draft.data.push(item);
        } else {
          let index = draft.data.findIndex((d: any) => d.id === item.id);
          draft.data[index] = item;
        }
      }),
    add: () =>
      set((draft: any) => {
        draft.action = "add";
        draft.item = initialData;
      }),
    select: (item: any) =>
      set((draft: any) => {
        draft.action = "update";
        draft.item = item;
      }),
    ...(extend ? extend(set) : {}),
  }));
};

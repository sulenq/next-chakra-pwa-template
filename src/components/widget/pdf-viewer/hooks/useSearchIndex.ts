import { useCallback, useRef, useState } from "react";
import {
  getPage,
  getPageTextContent,
  type PDFDocumentProxy,
} from "../engine/pdfEngine";

export type SearchMatch = {
  pageNum: number;
  itemIndex: number;
  charOffset: number;
  length: number;
};

type SearchState = {
  query: string;
  matches: SearchMatch[];
  currentIndex: number;
  searching: boolean;
};

export function useSearchIndex(doc: PDFDocumentProxy | null) {
  const [state, setState] = useState<SearchState>({
    query: "",
    matches: [],
    currentIndex: -1,
    searching: false,
  });

  const textCache = useRef<Map<number, any[]>>(new Map());

  const search = useCallback(
    async (query: string) => {
      if (!doc || !query.trim()) {
        setState({ query, matches: [], currentIndex: -1, searching: false });
        return;
      }

      setState((prev) => ({ ...prev, query, searching: true }));

      const allMatches: SearchMatch[] = [];
      const needle = query.toLowerCase();

      for (let p = 1; p <= doc.numPages; p++) {
        let items = textCache.current.get(p);

        if (!items) {
          const page = await getPage(doc, p);
          const content = await getPageTextContent(page);
          items = content.items.filter((item: any) => "str" in item);
          textCache.current.set(p, items);
        }

        items.forEach((item: any, itemIndex: number) => {
          const text = item.str.toLowerCase();
          let idx = 0;
          while ((idx = text.indexOf(needle, idx)) !== -1) {
            allMatches.push({
              pageNum: p,
              itemIndex,
              charOffset: idx,
              length: needle.length,
            });
            idx += needle.length;
          }
        });
      }

      setState({
        query,
        matches: allMatches,
        currentIndex: allMatches.length > 0 ? 0 : -1,
        searching: false,
      });
    },
    [doc],
  );

  const nextMatch = useCallback(() => {
    setState((prev) => {
      if (prev.matches.length === 0) return prev;
      return {
        ...prev,
        currentIndex: (prev.currentIndex + 1) % prev.matches.length,
      };
    });
  }, []);

  const prevMatch = useCallback(() => {
    setState((prev) => {
      if (prev.matches.length === 0) return prev;
      return {
        ...prev,
        currentIndex:
          (prev.currentIndex - 1 + prev.matches.length) % prev.matches.length,
      };
    });
  }, []);

  const clearSearch = useCallback(() => {
    setState({ query: "", matches: [], currentIndex: -1, searching: false });
  }, []);

  return {
    ...state,
    search,
    nextMatch,
    prevMatch,
    clearSearch,
    currentMatch:
      state.currentIndex >= 0 ? state.matches[state.currentIndex] : null,
  };
}

import { useRef, useCallback } from "react";
import {
  FetchNextPageOptions,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface InfiniteScrollProps {
  isLoading: boolean;
  hasNextPage: boolean | undefined;
  fetchNextPage: (
    options?: FetchNextPageOptions
  ) => Promise<InfiniteQueryObserverResult<AxiosResponse<any, any>, unknown>>;
  isFetchingNextPage: boolean;
}

const useInfiniteScroll = ({
  isLoading,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
}: InfiniteScrollProps) => {
  const intObserver = useRef<IntersectionObserver | null>(null);

  const lastItemRef = useCallback(
    (item: HTMLElement | null) => {
      if (isLoading) return;

      if (intObserver.current) intObserver.current.disconnect();

      intObserver.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        },
        {
          rootMargin: "0px",
          threshold: 1.0,
        }
      );

      if (item) intObserver.current.observe(item);
    },
    [isLoading, hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  return lastItemRef;
};

export default useInfiniteScroll;

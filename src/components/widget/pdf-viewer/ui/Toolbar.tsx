"use client";

import { Box, HStack, IconButton, Input, Text } from "@chakra-ui/react";
import {
  IconMinus,
  IconPlus,
  IconSearch,
  IconChevronUp,
  IconChevronDown,
  IconX,
} from "@tabler/icons-react";
import { useState, useRef, useCallback } from "react";

type Props = {
  // Zoom
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  // Pages
  numPages: number;
  onGoToPage: (page: number) => void;
  // Search
  onSearch: (query: string) => void;
  searchMatches: number;
  searchCurrentIndex: number;
  onNextMatch: () => void;
  onPrevMatch: () => void;
  onClearSearch: () => void;
};

export default function Toolbar({
  scale,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  numPages,
  onGoToPage,
  onSearch,
  searchMatches,
  searchCurrentIndex,
  onNextMatch,
  onPrevMatch,
  onClearSearch,
}: Props) {
  const [showSearch, setShowSearch] = useState(false);
  const [pageInput, setPageInput] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchToggle = useCallback(() => {
    setShowSearch((prev) => {
      const next = !prev;
      if (!next) onClearSearch();
      else setTimeout(() => searchInputRef.current?.focus(), 50);
      return next;
    });
  }, [onClearSearch]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      // Debounce search
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
      searchTimerRef.current = setTimeout(() => {
        onSearch(val);
      }, 300);
    },
    [onSearch],
  );

  const handlePageSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const num = parseInt(pageInput, 10);
      if (!isNaN(num) && num >= 1 && num <= numPages) {
        onGoToPage(num);
      }
      setPageInput("");
    },
    [pageInput, numPages, onGoToPage],
  );

  return (
    <Box
      position="sticky"
      top={0}
      zIndex={10}
      bg="bg"
      borderBottomWidth="1px"
      borderColor="border"
      px={3}
      py={1.5}
    >
      <HStack justify="space-between" gap={2}>
        {/* Left — Page navigation */}
        <HStack gap={1}>
          <form onSubmit={handlePageSubmit}>
            <Input
              size="xs"
              w="50px"
              textAlign="center"
              placeholder="Page"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
            />
          </form>
          <Text fontSize="xs" color="fg.muted" whiteSpace="nowrap">
            / {numPages}
          </Text>
        </HStack>

        {/* Center — Zoom controls */}
        <HStack gap={0.5}>
          <IconButton
            aria-label="Zoom out"
            size="xs"
            variant="ghost"
            onClick={onZoomOut}
          >
            <IconMinus size={16} />
          </IconButton>

          <Text
            fontSize="xs"
            w="50px"
            textAlign="center"
            cursor="pointer"
            onClick={onResetZoom}
            userSelect="none"
          >
            {Math.round(scale * 100)}%
          </Text>

          <IconButton
            aria-label="Zoom in"
            size="xs"
            variant="ghost"
            onClick={onZoomIn}
          >
            <IconPlus size={16} />
          </IconButton>
        </HStack>

        {/* Right — Search toggle */}
        <HStack gap={0.5}>
          <IconButton
            aria-label="Search"
            size="xs"
            variant={showSearch ? "subtle" : "ghost"}
            onClick={handleSearchToggle}
          >
            <IconSearch size={16} />
          </IconButton>
        </HStack>
      </HStack>

      {/* Search bar (expandable) */}
      {showSearch && (
        <HStack mt={1.5} mb={1} gap={1}>
          <Input
            ref={searchInputRef}
            size="xs"
            placeholder="Search in PDF..."
            onChange={handleSearchChange}
            flex={1}
          />

          {searchMatches > 0 && (
            <Text fontSize="xs" color="fg.muted" whiteSpace="nowrap">
              {searchCurrentIndex + 1}/{searchMatches}
            </Text>
          )}

          <IconButton
            aria-label="Previous match"
            size="xs"
            variant="ghost"
            onClick={onPrevMatch}
            disabled={searchMatches === 0}
          >
            <IconChevronUp size={14} />
          </IconButton>

          <IconButton
            aria-label="Next match"
            size="xs"
            variant="ghost"
            onClick={onNextMatch}
            disabled={searchMatches === 0}
          >
            <IconChevronDown size={14} />
          </IconButton>

          <IconButton
            aria-label="Close search"
            size="xs"
            variant="ghost"
            onClick={handleSearchToggle}
          >
            <IconX size={14} />
          </IconButton>
        </HStack>
      )}
    </Box>
  );
}

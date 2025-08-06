'use client';

import React, { useState, useEffect } from 'react';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { PiMagnifyingGlass, PiBookmark, PiLink } from 'react-icons/pi';
import { useActiveState } from '@/store/activeStateStore';

interface SearchResult {
  id: string;
  title: string;
  type: 'collection' | 'link';
  description?: string;
  url?: string;
  collectionTitle?: string;
}

interface SearchCommandProps {
  onSearch: (query: string) => Promise<SearchResult[]>;
}

export function SearchCommand({ onSearch }: SearchCommandProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const { setActiveItem } = useActiveState();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      setLoading(true);
      try {
        const searchResults = await onSearch(query);
        setResults(searchResults);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query, onSearch]);

  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    setQuery('');

    if (result.type === 'collection') {
      setActiveItem('Saved');
      // You might want to add a way to filter to specific collection
    } else if (result.type === 'link' && result.url) {
      window.open(result.url, '_blank');
    }
  };

  return (
    <>
      <div className="relative">
        <PiMagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <button
          onClick={() => setOpen(true)}
          className="flex h-10 w-full items-center rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm text-muted-foreground ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Search collections and links...
          <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <DialogTitle>
          <VisuallyHidden>Search collections and links</VisuallyHidden>
        </DialogTitle>
        <CommandInput
          placeholder="Search collections and links..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>
            {loading ? 'Searching...' : 'No results found.'}
          </CommandEmpty>

          {results.length > 0 && (
            <>
              <CommandGroup heading="Collections">
                {results
                  .filter((result) => result.type === 'collection')
                  .map((result) => (
                    <CommandItem
                      key={result.id}
                      value={result.title}
                      onSelect={() => handleSelect(result)}
                    >
                      <PiBookmark className="mr-2 h-4 w-4" />
                      <div className="flex flex-col">
                        <span>{result.title}</span>
                        {result.description && (
                          <span className="text-xs text-muted-foreground">
                            {result.description}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
              </CommandGroup>

              <CommandGroup heading="Links">
                {results
                  .filter((result) => result.type === 'link')
                  .map((result) => (
                    <CommandItem
                      key={result.id}
                      value={result.title}
                      onSelect={() => handleSelect(result)}
                    >
                      <PiLink className="mr-2 h-4 w-4" />
                      <div className="flex flex-col">
                        <span>{result.title}</span>
                        <div className="text-xs text-muted-foreground">
                          {result.collectionTitle && (
                            <span>in {result.collectionTitle} • </span>
                          )}
                          {result.url && (
                            <span className="truncate">{result.url}</span>
                          )}
                        </div>
                      </div>
                    </CommandItem>
                  ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}

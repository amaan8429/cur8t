import React from 'react';
import { PiMagnifyingGlass, PiFunnel, PiCaretDown, PiX } from 'react-icons/pi';
import { Input } from '@/components/ui/input';
import { PiGridFour, PiTable } from 'react-icons/pi';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

export interface FilterOptions {
  sortBy: 'newest' | 'oldest' | 'title' | 'domain';
  dateRange: 'all' | 'today' | 'week' | 'month';
  domains: string[];
}

interface HeaderProps {
  view: 'grid' | 'table';
  setView: (view: 'grid' | 'table') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterOptions: FilterOptions;
  setFilterOptions: (options: FilterOptions) => void;
  availableDomains: string[];
}

const ManageLinksHeader = ({
  view,
  setView,
  searchQuery,
  setSearchQuery,
  filterOptions,
  setFilterOptions,
  availableDomains,
}: HeaderProps) => {
  const activeFiltersCount = React.useMemo(() => {
    let count = 0;
    if (filterOptions.sortBy !== 'newest') count++;
    if (filterOptions.dateRange !== 'all') count++;
    if (filterOptions.domains.length > 0) count++;
    return count;
  }, [filterOptions]);

  const clearAllFilters = () => {
    setFilterOptions({
      sortBy: 'newest',
      dateRange: 'all',
      domains: [],
    });
  };

  const toggleDomain = (domain: string) => {
    const newDomains = filterOptions.domains.includes(domain)
      ? filterOptions.domains.filter((d) => d !== domain)
      : [...filterOptions.domains, domain];

    setFilterOptions({
      ...filterOptions,
      domains: newDomains,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search and View Toggle Group */}
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <PiMagnifyingGlass className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search links..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setView('grid')}
              disabled={view === 'grid'}
            >
              <PiGridFour className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setView('table')}
              disabled={view === 'table'}
            >
              <PiTable className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filters Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto relative">
              <PiFunnel className="h-4 w-4 mr-2" />
              Filters
              <PiCaretDown className="h-4 w-4 ml-2" />
              {activeFiltersCount > 0 && (
                <Badge
                  variant="secondary"
                  className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex items-center justify-between">
              Filter Options
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="h-auto p-1 text-xs"
                >
                  Clear All
                </Button>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* Sort By */}
            <DropdownMenuLabel>Sort By</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                setFilterOptions({ ...filterOptions, sortBy: 'newest' })
              }
              className={filterOptions.sortBy === 'newest' ? 'bg-accent' : ''}
            >
              Newest First
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                setFilterOptions({ ...filterOptions, sortBy: 'oldest' })
              }
              className={filterOptions.sortBy === 'oldest' ? 'bg-accent' : ''}
            >
              Oldest First
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                setFilterOptions({ ...filterOptions, sortBy: 'title' })
              }
              className={filterOptions.sortBy === 'title' ? 'bg-accent' : ''}
            >
              Title A-Z
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                setFilterOptions({ ...filterOptions, sortBy: 'domain' })
              }
              className={filterOptions.sortBy === 'domain' ? 'bg-accent' : ''}
            >
              Domain A-Z
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Date Range */}
            <DropdownMenuLabel>Date Range</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                setFilterOptions({ ...filterOptions, dateRange: 'all' })
              }
              className={filterOptions.dateRange === 'all' ? 'bg-accent' : ''}
            >
              All Time
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                setFilterOptions({ ...filterOptions, dateRange: 'today' })
              }
              className={filterOptions.dateRange === 'today' ? 'bg-accent' : ''}
            >
              Today
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                setFilterOptions({ ...filterOptions, dateRange: 'week' })
              }
              className={filterOptions.dateRange === 'week' ? 'bg-accent' : ''}
            >
              This Week
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                setFilterOptions({ ...filterOptions, dateRange: 'month' })
              }
              className={filterOptions.dateRange === 'month' ? 'bg-accent' : ''}
            >
              This Month
            </DropdownMenuItem>

            {availableDomains.length > 0 && (
              <>
                <DropdownMenuSeparator />

                {/* Domains */}
                <DropdownMenuLabel>Filter by Domain</DropdownMenuLabel>
                {availableDomains.slice(0, 8).map((domain) => (
                  <DropdownMenuCheckboxItem
                    key={domain}
                    checked={filterOptions.domains.includes(domain)}
                    onCheckedChange={() => toggleDomain(domain)}
                  >
                    {domain}
                  </DropdownMenuCheckboxItem>
                ))}
                {availableDomains.length > 8 && (
                  <DropdownMenuItem className="text-muted-foreground text-xs">
                    +{availableDomains.length - 8} more domains
                  </DropdownMenuItem>
                )}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filterOptions.sortBy !== 'newest' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Sort:{' '}
              {filterOptions.sortBy === 'oldest'
                ? 'Oldest First'
                : filterOptions.sortBy === 'title'
                  ? 'Title A-Z'
                  : 'Domain A-Z'}
              <PiX
                className="h-3 w-3 cursor-pointer"
                onClick={() =>
                  setFilterOptions({ ...filterOptions, sortBy: 'newest' })
                }
              />
            </Badge>
          )}
          {filterOptions.dateRange !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filterOptions.dateRange === 'today'
                ? 'Today'
                : filterOptions.dateRange === 'week'
                  ? 'This Week'
                  : 'This Month'}
              <PiX
                className="h-3 w-3 cursor-pointer"
                onClick={() =>
                  setFilterOptions({ ...filterOptions, dateRange: 'all' })
                }
              />
            </Badge>
          )}
          {filterOptions.domains.map((domain) => (
            <Badge
              key={domain}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {domain}
              <PiX
                className="h-3 w-3 cursor-pointer"
                onClick={() => toggleDomain(domain)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageLinksHeader;

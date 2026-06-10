import { useCallback, useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchUsers } from "../api/usersApi";
import { useDebounce } from "../hooks/useDebounce";
import UserCard from "../components/UserCard";
import { FixedSizeList as List } from "react-window";
import { ListOnItemsRenderedProps } from "react-window";
import { useSearchParams } from "react-router";
import SearchInput from "../components/SearchInput";
import SortControls from "../components/SortControls";
import FilterSidebar from "../components/FilterSidebar";

function UserDirectoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [inputValue, setInputValue] = useState(
  searchParams.get('search') || ''
)
  // const search = searchParams.get("search") || "";
  const sortBy = searchParams.get("sortBy") || "first_name";
  const sortOrder = (searchParams.get("sortDir") || "asc") as "asc" | "desc";

  const debouncedSearch = useDebounce(inputValue, 400);
  const selectedNationalities = searchParams.get("nationalities")
    ? searchParams.get("nationalities")!.split(",").filter(Boolean)
    : [];

  const selectedHobbies = searchParams.get("hobbies")
    ? searchParams.get("hobbies")!.split(",").filter(Boolean)
    : [];

  const updateParam = useCallback(
    (key: string, value: string) => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
        return params;
      });
    },
    [setSearchParams],
  );

  useEffect(() => {
   updateParam('search', debouncedSearch)
}, [debouncedSearch])

  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const sidebarScrollTop = useRef(0);

  const saveSidebarScroll = () => {
    if (sidebarRef.current) {
      sidebarScrollTop.current = sidebarRef.current.scrollTop;
    }
  };

  const toggleNationality = (nationality: string) => {
    saveSidebarScroll();
    const updated = selectedNationalities.includes(nationality)
      ? selectedNationalities.filter((item) => item !== nationality)
      : [...selectedNationalities, nationality];
    updateParam("nationalities", updated.join(","));
  };

  const toggleHobby = (hobby: string) => {
    saveSidebarScroll();
    const updated = selectedHobbies.includes(hobby)
      ? selectedHobbies.filter((item) => item !== hobby)
      : [...selectedHobbies, hobby];
    updateParam("hobbies", updated.join(","));
  };

  const clearAllFilters = () => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.delete("nationalities");
      params.delete("hobbies");
      return params;
    });
  };

  const {
    data,
    isLoading,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: [
      "users",
      debouncedSearch,
      sortBy,
      sortOrder,
      selectedNationalities,
      selectedHobbies,
    ],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      fetchUsers({
        search: debouncedSearch,
        page: pageParam,
        limit: 20,
        sortBy,
        sortOrder,
        nationalities: selectedNationalities,
        hobbies: selectedHobbies,
      }),
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasMore
        ? lastPage.pagination.page + 1
        : undefined;
    },
  });

  const nationalityFilters = data?.pages[0]?.filters.nationalities ?? [];
  const hobbyFilters = data?.pages[0]?.filters.hobbies ?? [];

  useEffect(() => {
    if (sidebarRef.current) {
      sidebarRef.current.scrollTop = sidebarScrollTop.current;
    }
  }, [hobbyFilters, nationalityFilters]);

  const users = data?.pages.flatMap((page) => page.users) ?? [];
  const total = data?.pages[0]?.pagination.total ?? 0;

  const handleItemsRendered = ({
    visibleStopIndex,
  }: ListOnItemsRenderedProps) => {
    const isNearEnd = visibleStopIndex >= users.length - 5;
    if (isNearEnd && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const user = users[index];
    return (
      <div style={style} className="px-1 pb-4">
        <UserCard user={user} />
      </div>
    );
  };

  const hasSelectedFilters =
    selectedNationalities.length > 0 || selectedHobbies.length > 0;

  const activeFilterCount =
    selectedNationalities.length + selectedHobbies.length;

  const filterSidebarProps = {
    nationalityFilters,
    hobbyFilters,
    selectedNationalities,
    selectedHobbies,
    onNationalityToggle: toggleNationality,
    onHobbyToggle: toggleHobby,
  };

  return (
    <main className="h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="mx-auto flex h-full max-w-7xl flex-col p-4 sm:p-6">
        <h1 className="mb-4 text-2xl font-bold sm:mb-6 sm:text-3xl">
          Presight User Directory
        </h1>

        <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-[320px_1fr]">
          {/* Desktop sidebar - hidden on mobile */}
          <div className="hidden lg:block">
            <FilterSidebar {...filterSidebarProps} ref={sidebarRef} />
          </div>

          {/* Mobile filter drawer overlay */}
          {isFilterDrawerOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              {/* backdrop */}
              <div
                className="absolute inset-0 bg-black/60"
                onClick={() => setIsFilterDrawerOpen(false)}
              />

              {/* drawer - slides from bottom */}
              <div
                className="absolute bottom-0 left-0 right-0 flex flex-col rounded-t-2xl border-t border-slate-700 bg-slate-900"
                style={{ height: "100vh" }}
              >

                {/* scrollable middle */}
                <div className="flex-1 overflow-y-auto px-4 py-4">
                  <FilterSidebar
                    {...filterSidebarProps}
                    isMobileDrawer
                    onClose={() => setIsFilterDrawerOpen(false)}
                  />
                </div>

                {/* fixed footer */}
                <div className="shrink-0 border-t border-slate-700 px-4 py-3">
                  <button
                    onClick={() => setIsFilterDrawerOpen(false)}
                    className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          <section className="min-h-0 overflow-hidden">
            <div className="mb-4 rounded-xl border border-slate-800 bg-slate-900 p-4">
              {/* Mobile filter button - hidden on desktop */}
              <div className="mb-3 flex items-center gap-2 lg:hidden">
                <button
                  onClick={() => setIsFilterDrawerOpen(true)}
                  className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-200 hover:bg-slate-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
                    />
                  </svg>
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {hasSelectedFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {hasSelectedFilters && (
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  {selectedNationalities.map((nationality) => (
                    <button
                      key={nationality}
                      type="button"
                      onClick={() => toggleNationality(nationality)}
                      className="rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-300 hover:bg-blue-500/30"
                    >
                      {nationality} ×
                    </button>
                  ))}

                  {selectedHobbies.map((hobby) => (
                    <button
                      key={hobby}
                      type="button"
                      onClick={() => toggleHobby(hobby)}
                      className="rounded-full bg-purple-500/20 px-3 py-1 text-sm text-purple-300 hover:bg-purple-500/30"
                    >
                      {hobby} ×
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="hidden text-sm text-slate-400 hover:text-slate-200 lg:block cursor-pointer"
                  >
                    Clear all
                  </button>
                </div>
              )}

              <SearchInput
                value={inputValue}
                onChange={(value) => setInputValue(value)}
              />

              <SortControls
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortByChange={(value) => updateParam("sortBy", value)}
                onSortOrderChange={(value) => updateParam("sortDir", value)}
              />

              <div className="mt-2 text-sm text-slate-400">
                {total} users found
                {isFetching && !isFetchingNextPage && " · Updating results..."}
              </div>
            </div>

            {isLoading && (
              <div className="grid gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-20 animate-pulse rounded-xl border border-slate-800 bg-slate-900 sm:h-24"
                  />
                ))}
              </div>
            )}

            {error && (
              <p className="rounded-xl border border-red-900 bg-red-950 p-6 text-red-300">
                Failed to load users.
              </p>
            )}

            {!isLoading && users.length === 0 && (
              <p className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-slate-400">
                No users found.
              </p>
            )}

            {!isLoading && users.length > 0 && (
              <List
                height={window.innerHeight - 320}
                itemCount={users.length}
                itemSize={150}
                width="100%"
                onItemsRendered={handleItemsRendered}
              >
                {Row}
              </List>
            )}

            {isFetchingNextPage && (
              <p className="mt-2 text-center text-sm text-slate-400">
                Loading more...
              </p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default UserDirectoryPage;

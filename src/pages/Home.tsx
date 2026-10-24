import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClaim, createItem, getClaims, getItems, getUsers, markItemClaimed, type NewItem } from "../api/client";
import { ClaimList } from "../components/ClaimList";
import { ItemCard } from "../components/ItemCard";
import { NewItemForm } from "../components/NewItemForm";
import { usePrevious } from "../hooks/usePrevious";
import { useToggle } from "../hooks/useToggle";
import { useUiStore } from "../store/uiStore";
import type { Item } from "../types";

export default function Home() {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("Loading campus lost & found data...");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showFound, toggleShowFound] = useToggle(true);
  const [isDark, toggleDark] = useToggle(false);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const previousMessage = usePrevious(message);
  const selectedUserId = useUiStore((state) => state.selectedUserId);
  const setSelectedUserId = useUiStore((state) => state.setSelectedUserId);

  const itemsQuery = useQuery({ queryKey: ["items"], queryFn: getItems });
  const claimsQuery = useQuery({ queryKey: ["claims"], queryFn: getClaims });
  const usersQuery = useQuery({ queryKey: ["users"], queryFn: getUsers });
  const items = itemsQuery.data ?? [];
  const claims = claimsQuery.data ?? [];
  const users = usersQuery.data ?? [];
  const selectedUser = users.find((user) => user.id === selectedUserId);

  const addItemMutation = useMutation({
    mutationFn: (item: NewItem) => createItem(item),
    onSuccess: (item) => {
      setMessage(`Added ${item.type} item: ${item.title}`);
      void queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });

  const claimMutation = useMutation({
    mutationFn: async (item: Item) => {
      await createClaim({
        itemId: item.id,
        claimerName: selectedUser?.name ?? "Campus Security",
        status: "verified",
      });
      return markItemClaimed(item);
    },
    onSuccess: (_item, item) => {
      setMessage(`Marked ${item.title} as claimed.`);
      void queryClient.invalidateQueries({ queryKey: ["items"] });
      void queryClient.invalidateQueries({ queryKey: ["claims"] });
    },
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim().toLowerCase()), 250);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (!itemsQuery.isLoading && !claimsQuery.isLoading && !usersQuery.isLoading && !itemsQuery.error && !claimsQuery.error && !usersQuery.error) {
      setMessage("Campus lost & found data loaded.");
    }
  }, [claimsQuery.error, claimsQuery.isLoading, itemsQuery.error, itemsQuery.isLoading, usersQuery.error, usersQuery.isLoading]);

  const filteredItems = items.filter((item) => {
    const query = debouncedSearch;
    return query === "" || [item.title, item.description, item.location, item.reportedBy].some((value) => value?.toLowerCase().includes(query));
  });
  const lostItems = filteredItems.filter((item) => item.type === "lost");
  const foundItems = filteredItems.filter((item) => item.type === "found");
  const isLoading = itemsQuery.isLoading || claimsQuery.isLoading || usersQuery.isLoading;
  const error = itemsQuery.error ?? claimsQuery.error ?? usersQuery.error;

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => setSearch(event.target.value);
  const claimItem = (itemId: number) => {
    const item = items.find((itemData) => itemData.id === itemId);
    if (item) claimMutation.mutate(item);
  };

  return (
    <main className="page-frame">
      <header className="home-hero">
        <div>
          <p className="eyebrow">Campus Lost & Found</p>
          <h1>Track lost and found items on campus</h1>
          <p className="intro">Report items, search items, and mark them claimed when they are returned.</p>
          <div className="user-select-row">
            <label>
              User
              <select value={selectedUserId ?? ""} onChange={(event) => setSelectedUserId(event.target.value ? Number(event.target.value) : null)}>
                <option value="">(not selected)</option>
                {users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
              </select>
            </label>
            <div className="current-user">Signed in as: {selectedUser?.name ?? "Guest"}</div>
          </div>
        </div>
        <div className="message-stack">
          <div className="hero-actions">
            <div className="message-stack__previous">{previousMessage ?? ""}</div>
            <button type="button" onClick={toggleDark} className="clear-button">{isDark ? "Light mode" : "Dark mode"}</button>
          </div>
          <div className="message-stack__current">{message}</div>
        </div>
      </header>

      <section className="dashboard-grid">
        <div className="form-panel">
          <NewItemForm onAddItem={(item) => addItemMutation.mutate(item)} />
          {addItemMutation.isPending && <p className="mt-2 text-sm">Saving item...</p>}
          {addItemMutation.error && <p className="mt-2 text-sm text-red-600">Could not save item: {addItemMutation.error.message}</p>}
          {claimMutation.error && <p className="mt-2 text-sm text-red-600">Could not mark item claimed: {claimMutation.error.message}</p>}
        </div>

        <div className="data-stack">
          <div className="data-panel">
            <div className="panel-heading">
              <div><p className="panel-kicker">Open reports</p><h2>Lost items</h2><p>Items reported as missing by campus users.</p></div>
              <div className="search-field"><label>Search the board</label><div><input ref={searchRef} type="search" value={search} onChange={handleSearchChange} placeholder="Title, place, reporter" /><button type="button" onClick={() => setSearch("")} className="clear-button" aria-label="Clear search">Clear</button></div></div>
            </div>
            <div>
              {isLoading ? <p className="loading-state">Loading the campus board...</p> : error ? <p className="error-state">Could not load data: {error.message}</p> : lostItems.length === 0 ? <div className="empty-state">No lost items match your search.</div> : <div className="items-grid">{lostItems.map((item) => <ItemCard key={item.id} item={item} onClaim={claimItem} variant="compact" />)}</div>}
            </div>
          </div>

          <div className="data-panel">
            <div className="panel-heading"><div><p className="panel-kicker">Recovered recently</p><h2>Found items</h2><p>Items recovered by staff or students.</p></div><button type="button" className="clear-button" onClick={toggleShowFound}>{showFound ? "Hide list" : "Show list"}</button></div>
            {showFound && <div>{isLoading ? <p className="loading-state">Loading recovered items...</p> : error ? <p className="error-state">Could not load data: {error.message}</p> : foundItems.length === 0 ? <div className="empty-state">No found items match your search.</div> : <div className="items-grid">{foundItems.map((item) => <ItemCard key={item.id} item={item} onClaim={claimItem} variant="compact" />)}</div>}</div>}
          </div>
        </div>

        <div className="claim-panel"><ClaimList claims={claims} items={items} /></div>
      </section>
    </main>
  );
}

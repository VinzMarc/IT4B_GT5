import type { Claim, Item } from "../types/index";

export interface ClaimListProps {
  claims: Claim[];
  items: Item[];
}

export function ClaimList({ claims, items }: ClaimListProps) {
  return (
    <section className="claim-list">
      <h2 className="text-lg font-semibold">Claim history</h2>

      {claims.length === 0 ? (
        <div className="mt-3 flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m4 4v-6a2 2 0 00-2-2H8a2 2 0 00-2 2v6m6 0v2m0-2H9"></path></svg>
          <div>
            <div className="font-medium">No claims yet</div>
            <div className="text-xs">Once an item is marked claimed, it appears here.</div>
          </div>
        </div>
      ) : (
        <ul className="mt-3 space-y-2 text-sm">
          {claims.map((claim) => {
            const item = items.find((itemData) => itemData.id === claim.itemId);
            return (
              <li key={claim.id} className="flex items-start justify-between bg-gray-50 dark:bg-gray-700 rounded p-2">
                <div>
                  <div className="font-medium">{claim.claimerName}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">claimed <em>{item ? item.title : "item"}</em></div>
                </div>
                <div className="text-xs text-gray-500">{claim.requestedAt}</div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

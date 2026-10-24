import type { MouseEvent } from "react";
import type { Item } from "../types/index";

export interface ItemCardProps {
  item: Item;
  onClaim: (itemId: number) => void;
  variant?: "compact" | "default";
}

export function ItemCard({ item, onClaim, variant = "default" }: ItemCardProps) {
  const handleClaim = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onClaim(item.id);
  };

  if (variant === "compact") {
    return (
      <article className={`item-card ${item.type === "found" ? "item-card--found" : ""}`}>
        <div className="item-card__top">
          <h3>{item.title}</h3>
          <span className="item-type">
              {item.type === "lost" ? "Lost" : "Found"}
          </span>
        </div>
        <p className="item-card__location">{item.location}</p>
        <div className="item-card__footer">
          <span className={`item-status ${item.isClaimed ? "claimed" : ""}`}>
            {item.isClaimed ? "Claimed" : "Available"}
          </span>
          {!item.isClaimed && (
            <button type="button" onClick={handleClaim} className="claim-button">
              Claim
            </button>
          )}
        </div>
      </article>
    );
  }

  return (
    <article className={`item-card ${item.type === "found" ? "item-card--found" : ""}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <span className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              {item.type === "lost" ? "Lost" : "Found"}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
          <p className="mt-2 text-sm">
            <strong>Location:</strong> {item.location}
          </p>
          <p className="text-sm">
            <strong>Reported by:</strong> {item.reportedBy}
          </p>
          <p className="text-sm">
            <strong>Date:</strong> {item.reportedAt}
          </p>
        </div>

        <div className="ml-4 flex flex-col items-end space-y-2">
          <p className="text-sm font-medium">
            Status: <span className={item.isClaimed ? "text-yellow-400" : "text-green-500"}>
              {item.isClaimed ? "Claimed" : "Available"}
            </span>
          </p>

          {!item.isClaimed && (
            <button
              type="button"
              onClick={handleClaim}
              className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-500"
            >
              Mark as Claimed
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

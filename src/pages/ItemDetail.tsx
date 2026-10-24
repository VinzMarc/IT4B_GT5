import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getItem } from "../api/client";

export default function ItemDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const itemId = Number(id);
  const itemQuery = useQuery({
    queryKey: ["items", itemId],
    queryFn: () => getItem(itemId),
    enabled: Number.isInteger(itemId) && itemId > 0,
  });
  const item = itemQuery.data;

  if (itemQuery.isLoading) {
    return <div className="max-w-4xl mx-auto p-4">Loading item...</div>;
  }

  if (itemQuery.error) {
    return <div className="max-w-4xl mx-auto p-4 text-red-600">Could not load item: {itemQuery.error.message}</div>;
  }

  if (!item) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-xl font-semibold">Item not found</h2>
        <p className="mt-2">No item matches that id.</p>
        <button className="mt-4 px-3 py-1 bg-gray-200 rounded" onClick={() => navigate(-1)}>
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white dark:bg-gray-800 rounded">
      <h2 className="text-2xl font-semibold">{item.title}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300">Reported by: {item.reportedBy} on {item.reportedAt}</p>
      <p className="mt-2">{item.description}</p>
      <p className="mt-2 font-medium">Location: {item.location}</p>
      <div className="mt-4">
        <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    </div>
  );
}

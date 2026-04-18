"use client";

import { useState } from "react";

export default function ExpandableGrid({
  children,
  visibleCount = 6,
  showMoreLabel = "Show all",
  showLessLabel = "Show less",
  className = "",
}: {
  children: React.ReactNode[];
  visibleCount?: number;
  showMoreLabel?: string;
  showLessLabel?: string;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = children.length > visibleCount;
  const visible = expanded ? children : children.slice(0, visibleCount);

  return (
    <>
      <div className={className}>{visible}</div>
      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-sm text-accent hover:text-ink transition-colors cursor-pointer"
        >
          {expanded ? showLessLabel : `${showMoreLabel} (${children.length - visibleCount} more)`}
        </button>
      )}
    </>
  );
}

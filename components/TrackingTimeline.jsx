"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Truck, Phone, Package } from "lucide-react";
import dayjs from "dayjs";

const LABELS = {
  ORDER_PLACED: "Order placed",
  ORDER_CONFIRMED: "Order confirmed",
  VERIFICATION: "Call for verification",
  DISPATCHED: "Dispatched",
  IN_TRANSIT: "In transit",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  RETURNED: "Returned",
};

function statusIcon(status) {
  switch (status) {
    case "OUT_FOR_DELIVERY":
    case "IN_TRANSIT":
      return <Truck className="w-4 h-4" />;
    case "VERIFICATION":
      return <Phone className="w-4 h-4" />;
    case "ORDER_PLACED":
    case "ORDER_CONFIRMED":
    case "DISPATCHED":
    default:
      return <Package className="w-4 h-4" />;
  }
}

export function TrackingTimeline({
  steps = [],
  currentStatus,
  showAnchors = true,
}) {
  const lastCompletedIndex = steps.findLastIndex?.((s) => s.completed) ?? (() => {
    let idx = -1;
    steps.forEach((s, i) => {
      if (s.completed) idx = i;
    });
    return idx;
  })();

  return (
    <ol className="relative border-s border-white/10 pl-6 space-y-6">
      {steps.map((s, i) => {
        const isCompleted = s.completed;
        const isCurrent = s.code === currentStatus || i === lastCompletedIndex + 1;
        return (
          <li key={s.code} id={showAnchors ? s.code : undefined} className="group">
            <span className={cn(
              "absolute -start-2 top-1.5 rounded-full",
              isCompleted ? "text-green-500" : isCurrent ? "text-blue-400" : "text-gray-400"
            )}>
              {isCompleted ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Circle className="w-4 h-4" />
              )}
            </span>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
              <div className="flex items-center gap-2">
                {statusIcon(s.code)}
                <p className="text-sm font-medium text-white">{s.label}</p>
                {isCurrent && !isCompleted && (
                  <Badge className="border-white/20 bg-white/10">Current</Badge>
                )}
                {isCompleted && <Badge className="border-white/20 bg-green-500/20">Done</Badge>}
              </div>
              <div className="text-xs text-white/70">
                {s.timestamp ? dayjs(s.timestamp).format("MMM D, YYYY h:mm A") : ""}
              </div>
            </div>
            {s.message && (
              <p className="mt-1 text-sm text-white/80">{s.message}</p>
            )}
            {s.location && (
              <p className="text-xs text-white/60">{s.location}</p>
            )}
          </li>
        );
      })}
    </ol>
  );
}

export function buildSteps({ updates = [], currentStatus, STATUS_ORDER }) {
  const order = STATUS_ORDER || [];
  const latestByCode = new Map();
  updates.forEach((u) => {
    const code = u.status;
    const prev = latestByCode.get(code);
    if (!prev || (u.timestamp && dayjs(u.timestamp).isAfter(dayjs(prev.timestamp)))) {
      latestByCode.set(code, u);
    }
  });

  const steps = order.map((code) => {
    const u = latestByCode.get(code);
    const completed = Boolean(u);
    return {
      code,
      label: LABELS[code] || code.replaceAll("_", " ").toLowerCase(),
      timestamp: u?.timestamp || null,
      message: u?.message || u?.rawStatus || null,
      location: u?.location || null,
      completed,
    };
  });

  // If we have updates with codes not in the list, append them
  updates.forEach((u) => {
    if (!order.includes(u.status)) {
      steps.push({
        code: u.status,
        label: LABELS[u.status] || u.status.replaceAll("_", " ").toLowerCase(),
        timestamp: u.timestamp || null,
        message: u.message || u.rawStatus || null,
        location: u.location || null,
        completed: true,
      });
    }
  });

  return steps;
}

import { useCallback, useEffect, useState } from "react";
import { api } from "../../lib/api";
import type { Car } from "../../types";

type CarResult = { items: Car[]; total: number };

export const PAGE_SIZE = 9;

export function useCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [make, setMake] = useState("");
  const [region, setRegion] = useState("");
  const [fuel, setFuel] = useState("");
  const [sort, setSort] = useState("newest");

  const loadCars = useCallback(
    async (nextPage = 1) => {
      setLoading(true);
      setError("");
      const params = new URLSearchParams({
        page: String(nextPage),
        limit: String(PAGE_SIZE),
        sort,
      });
      if (query.trim()) params.set("q", query.trim());
      if (make) params.set("make", make);
      if (region) params.set("region", region);
      if (fuel) params.set("fuel", fuel);
      try {
        const result = await api<CarResult>(`/api/cars?${params}`);
        setCars(result.items ?? []);
        setTotal(result.total ?? 0);
        setPage(nextPage);
      } catch (cause) {
        setError(
          cause instanceof Error
            ? cause.message
            : "E’lonlarni yuklab bo‘lmadi.",
        );
      } finally {
        setLoading(false);
      }
    },
    [query, make, region, fuel, sort],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => void loadCars(1), 220);
    return () => window.clearTimeout(timer);
  }, [loadCars]);

  const changePage = (newPage: number) => {
    void loadCars(newPage);
  };

  const resetFilters = () => {
    setQuery("");
    setMake("");
    setRegion("");
    setFuel("");
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return {
    cars,
    total,
    page,
    pageSize: PAGE_SIZE,
    totalPages,
    loading,
    error,
    query,
    make,
    region,
    fuel,
    sort,
    setQuery,
    setMake,
    setRegion,
    setFuel,
    setSort,
    setPage: changePage,
    resetFilters,
    loadCars,
  };
}

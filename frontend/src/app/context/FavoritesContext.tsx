import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api } from "../../lib/api";
import { useSession } from "./SessionContext";

type FavoritesContextValue = {
  favoriteIds: string[];
  isFavorite: (carId: string) => boolean;
  toggleFavorite: (carId: string) => Promise<boolean>;
  refreshFavoriteIds: () => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { member } = useSession();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const refreshFavoriteIds = useCallback(async () => {
    if (!member) {
      setFavoriteIds([]);
      return;
    }
    try {
      const ids = await api<string[]>("/api/cars/favorites/ids");
      if (Array.isArray(ids)) {
        setFavoriteIds(ids);
      }
    } catch {
      // Ignore background error
    }
  }, [member]);

  useEffect(() => {
    void refreshFavoriteIds();
  }, [refreshFavoriteIds]);

  const isFavorite = useCallback(
    (carId: string) => favoriteIds.includes(carId),
    [favoriteIds],
  );

  const toggleFavorite = useCallback(
    async (carId: string): Promise<boolean> => {
      if (!member) {
        return false;
      }

      // Optimistic update
      const wasFavorite = favoriteIds.includes(carId);
      const nextIds = wasFavorite
        ? favoriteIds.filter((id) => id !== carId)
        : [...favoriteIds, carId];
      setFavoriteIds(nextIds);

      try {
        const result = await api<{ isFavorite: boolean }>(
          `/api/cars/${carId}/favorite`,
          { method: "POST" },
        );
        if (result?.isFavorite) {
          setFavoriteIds((prev) =>
            prev.includes(carId) ? prev : [...prev, carId],
          );
          return true;
        } else {
          setFavoriteIds((prev) => prev.filter((id) => id !== carId));
          return false;
        }
      } catch (error) {
        // Rollback on error
        setFavoriteIds(favoriteIds);
        throw error;
      }
    },
    [member, favoriteIds],
  );

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favoriteIds,
      isFavorite,
      toggleFavorite,
      refreshFavoriteIds,
    }),
    [favoriteIds, isFavorite, toggleFavorite, refreshFavoriteIds],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}

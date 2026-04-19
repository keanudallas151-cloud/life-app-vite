import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "../supabaseClient";

export function useUserData(userId) {
  const [bookmarks,   setBookmarksState]  = useState([]);
  const [notes,       setNotesState]      = useState({});
  const [readKeys,    setReadKeysState]   = useState([]);
  const [highlights,  setHighlightsState] = useState([]);
  const [tsdProfile,  setTsdProfileState] = useState(null);
  const [momentumState, setMomentumStateRaw] = useState(null);
  const [loading,     setLoading]         = useState(false);
  const [error,       setError]           = useState("");

  const isGuest = !userId || userId === "_";
  const persistTimerRef = useRef(null);
  const pendingPatchRef = useRef(null);
  const persistInFlightRef = useRef(false);

  const clearPersistTimer = useCallback(() => {
    if (!persistTimerRef.current) return;
    clearTimeout(persistTimerRef.current);
    persistTimerRef.current = null;
  }, []);

  const applyFetchedData = useCallback((data = {}) => {
    setBookmarksState(data.bookmarks  ?? []);
    setNotesState(data.notes          ?? {});
    setReadKeysState(data.read_keys   ?? []);
    setHighlightsState(data.highlights ?? []);
    setTsdProfileState(data.tsd_profile ?? null);
    setMomentumStateRaw(data.momentum_state ?? null);
  }, []);

  const flushPersistQueue = useCallback(async () => {
    if (isGuest || persistInFlightRef.current || !pendingPatchRef.current) return;

    persistInFlightRef.current = true;
    clearPersistTimer();

    try {
      while (pendingPatchRef.current) {
        const patch = pendingPatchRef.current;
        pendingPatchRef.current = null;

        const payload = {
          user_id: userId,
          ...patch,
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabase
          .from("user_data")
          .upsert(payload, { onConflict: "user_id" });

        if (!error) {
          setError("");
          continue;
        }

        if (
          Object.prototype.hasOwnProperty.call(patch, "highlights") &&
          String(error.message || "").toLowerCase().includes("highlights")
        ) {
          const { highlights: _ignoredHighlights, ...fallbackPatch } = patch;
          if (Object.keys(fallbackPatch).length === 0) continue;

          const { error: fallbackError } = await supabase
            .from("user_data")
            .upsert(
              {
                user_id: userId,
                ...fallbackPatch,
                updated_at: new Date().toISOString(),
              },
              { onConflict: "user_id" },
            );

          if (fallbackError) {
            console.error("useUserData persist fallback:", fallbackError.message);
            setError("Profile sync is temporarily unavailable. Your latest changes may stay local until the connection recovers.");
          }
          continue;
        }

        console.error("useUserData persist:", error.message);
        setError("Profile sync is temporarily unavailable. Your latest changes may stay local until the connection recovers.");
      }
    } finally {
      persistInFlightRef.current = false;
      if (pendingPatchRef.current) void flushPersistQueue();
    }
  }, [clearPersistTimer, isGuest, userId]);

  const schedulePersist = useCallback((patch, delay = 250) => {
    if (isGuest) return;
    pendingPatchRef.current = {
      ...(pendingPatchRef.current || {}),
      ...patch,
    };
    clearPersistTimer();
    persistTimerRef.current = setTimeout(() => {
      persistTimerRef.current = null;
      void flushPersistQueue();
    }, delay);
  }, [clearPersistTimer, flushPersistQueue, isGuest]);

  useEffect(() => {
    clearPersistTimer();
    pendingPatchRef.current = null;
    persistInFlightRef.current = false;

    if (isGuest) {
      setBookmarksState([]);
      setNotesState({});
      setReadKeysState([]);
      setHighlightsState([]);
      setTsdProfileState(null);
      setMomentumStateRaw(null);
      setError("");
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError("");
    supabase
      .from("user_data")
      .select("bookmarks, notes, read_keys, highlights, tsd_profile, momentum_state")
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (!error) {
          if (data) applyFetchedData(data);
          setLoading(false);
          return;
        }

        if (!String(error.message || "").toLowerCase().includes("highlights")) {
          console.error("useUserData fetch:", error.message);
          setError("Profile sync is unavailable right now. Cached data will still work until Supabase responds again.");
          setLoading(false);
          return;
        }

        console.error("useUserData fetch: highlights column missing, using fallback query.");
        supabase
          .from("user_data")
          .select("bookmarks, notes, read_keys, tsd_profile, momentum_state")
          .eq("user_id", userId)
          .maybeSingle()
          .then(({ data: fallbackData, error: fallbackError }) => {
            if (cancelled) return;
            if (fallbackError) {
              console.error("useUserData fallback fetch:", fallbackError.message);
              setError("Profile sync is unavailable right now. Cached data will still work until Supabase responds again.");
              setLoading(false);
              return;
            }
            if (fallbackData) applyFetchedData({ ...fallbackData, highlights: [] });
            setLoading(false);
          })
          .catch(() => {
            if (cancelled) return;
            console.error("useUserData fallback query failed");
            setError("Profile sync is unavailable right now. Cached data will still work until Supabase responds again.");
            setLoading(false);
          });
      });
    return () => {
      cancelled = true;
    };
  }, [applyFetchedData, clearPersistTimer, userId, isGuest]);

  useEffect(() => () => clearPersistTimer(), [clearPersistTimer]);

  const setBookmarks = useCallback((v) => {
    setBookmarksState(v);
    schedulePersist({ bookmarks: v }, 180);
  }, [schedulePersist]);

  const setNotes = useCallback((v) => {
    setNotesState(v);
    schedulePersist({ notes: v }, 700);
  }, [schedulePersist]);

  const setReadKeys = useCallback((v) => {
    setReadKeysState(v);
    schedulePersist({ read_keys: v }, 180);
  }, [schedulePersist]);

  const setHighlights = useCallback((v) => {
    setHighlightsState(v);
    schedulePersist({ highlights: v }, 220);
  }, [schedulePersist]);

  const setTsdProfile = useCallback((v) => {
    setTsdProfileState(v);
    schedulePersist({ tsd_profile: v }, 220);
  }, [schedulePersist]);

  const setMomentumState = useCallback((v) => {
    setMomentumStateRaw(v);
    schedulePersist({ momentum_state: v }, 260);
  }, [schedulePersist]);

  const replaceAllData = useCallback((next) => {
    const merged = {
      bookmarks: next?.bookmarks ?? [],
      notes: next?.notes ?? {},
      read_keys: next?.read_keys ?? [],
      highlights: next?.highlights ?? [],
      tsd_profile: next?.tsd_profile ?? null,
      momentum_state: next?.momentum_state ?? null,
    };
    applyFetchedData(merged);
    schedulePersist(merged, 120);
  }, [applyFetchedData, schedulePersist]);

  return {
    bookmarks,  setBookmarks,
    notes,      setNotes,
    readKeys,   setReadKeys,
    highlights, setHighlights,
    tsdProfile, setTsdProfile,
    momentumState, setMomentumState,
    replaceAllData,
    loading,
    error,
  };
}

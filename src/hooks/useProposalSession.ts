import { useEffect, useRef, useState } from "react";
import {
  getStoredProposalSession,
  saveStoredProposalSession,
  clearStoredProposalSession,
  refreshProposalSessionIfNeeded,
  type ProposalSession,
} from "@/lib/companyStatus";

const CHECK_INTERVAL_MS = 5 * 60 * 1000; // check every 5 minutes

// Used by /company and /projects (both share the same Supabase login).
// Runs an immediate check on mount - so a session that already went stale
// while the tab was closed gets refreshed right away - then keeps checking
// on a timer for as long as the page stays open, so nobody has to notice
// or care that access tokens expire in the background.
export const useProposalSession = () => {
  const [session, setSessionState] = useState<ProposalSession | null>(() => getStoredProposalSession());
  const sessionRef = useRef(session);
  sessionRef.current = session;

  const setSession = (next: ProposalSession | null) => {
    if (next) saveStoredProposalSession(next);
    else clearStoredProposalSession();
    setSessionState(next);
  };

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      const current = sessionRef.current;
      if (!current) return;
      const refreshed = await refreshProposalSessionIfNeeded(current);
      if (!cancelled && refreshed?.access_token !== current.access_token) {
        setSessionState(refreshed);
      }
    };

    check();
    const interval = setInterval(check, CHECK_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return [session, setSession] as const;
};

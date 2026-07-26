import { useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { LayoutGrid, KanbanSquare, Users, LogOut, Menu, X, ArrowLeft, UserCircle, UserPlus } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import revhubLogo from "@/assets/RH-Logo-Light.png";

export type ProjectsSection = "assignments" | "board" | "team" | "profile";

type NavItem = {
  key: ProjectsSection;
  label: string;
  icon: typeof LayoutGrid;
};

// "Profile" is available to everyone - it's just editing your own name/
// title, not owner-only data, so it lives in both lists rather than the
// owner-only block below.
const MEMBER_ITEMS: NavItem[] = [
  { key: "assignments", label: "My assignments", icon: LayoutGrid },
  { key: "profile", label: "Profile", icon: UserCircle },
];

const OWNER_SHARED_ITEMS: NavItem[] = [
  { key: "assignments", label: "My assignments", icon: LayoutGrid },
  { key: "profile", label: "Profile", icon: UserCircle },
];
const OWNER_ONLY_ITEMS: NavItem[] = [
  { key: "board", label: "Company board", icon: KanbanSquare },
  { key: "team", label: "Team", icon: Users },
];

type ProjectsSidebarProps = {
  isOwner: boolean;
  activeSection: ProjectsSection;
  onSectionChange: (section: ProjectsSection) => void;
  memberName?: string | null;
  onSignOut: () => void;
  // Opens the add-contact form. Optional so pages that don't have that
  // modal wired up locally (CompanyDetailPage) can fall back to just
  // navigating back to /projects instead.
  onAddContact?: () => void;
};

// Wraps the existing /projects pages as navigation destinations rather than
// rebuilding their internals - a Member only ever sees "My assignments"
// (their outreach queue is the whole job), an Owner gets that plus Company
// board and Team below a divider, matching the trust boundary already
// enforced by the data layer (see fetchOwnerCompanyLeadFields and friends
// in projectContacts.ts) rather than inventing a second one here.
//
// Dark rail is a deliberate contrast choice against the warm off-white
// content canvas (see ProjectsPage.tsx) - a common pattern in the
// dashboard references this was modeled on, and it makes the nav read as
// a fixed piece of chrome rather than another content surface competing
// for attention.
const ProjectsSidebar = ({ isOwner, activeSection, onSectionChange, memberName, onSignOut, onAddContact }: ProjectsSidebarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavList = ({ onNavigate }: { onNavigate?: () => void }) => (
    <div className="flex h-full flex-col">
      <div className="px-3 pb-6 pt-7">
        <img src={revhubLogo} alt="RevHub" className="h-6 w-auto" />
        <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">Outreach</p>
      </div>

      {/* Navbar's site-wide nav is gone from /projects (it's a standalone
          tool now, not a marketing page) - this is the one way back to
          aboutchad.com so nobody gets stranded. */}
      <div className="px-2 pb-4">
        <Link to="/" className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-white/50 no-underline hover:bg-white/5 hover:text-white">
          <ArrowLeft size={14} />
          aboutchad.com
        </Link>
      </div>

      {onAddContact ? (
        <div className="px-2 pb-4">
          <button
            type="button"
            onClick={() => { onAddContact(); onNavigate?.(); }}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <UserPlus size={16} />
            Add contact
          </button>
        </div>
      ) : null}

      <nav className="flex flex-1 flex-col gap-1 px-2">
        <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/30">Workflow</p>
        {(isOwner ? OWNER_SHARED_ITEMS : MEMBER_ITEMS).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => { onSectionChange(key); onNavigate?.(); }}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
              activeSection === key ? "bg-primary/20 text-[#5DCAA5]" : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}

        {isOwner ? (
          <>
            <p className="px-2 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/30">Owner only</p>
            {OWNER_ONLY_ITEMS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => { onSectionChange(key); onNavigate?.(); }}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                  activeSection === key ? "bg-primary/20 text-[#5DCAA5]" : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </>
        ) : null}
      </nav>

      <div className="mt-auto border-t border-white/10 px-3 py-4">
        {memberName ? <p className="mb-2 truncate text-xs text-white/40">Signed in as {memberName}</p> : null}
        <button
          type="button"
          onClick={onSignOut}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop rail - fixed, not sticky, so it's truly locked in place
          regardless of how tall the content column gets or what any
          ancestor's overflow/stacking context is doing. Rendered via a
          portal straight onto document.body rather than in place in the
          page tree - position:fixed's containing block gets hijacked by
          *any* ancestor that later picks up a transform/filter/perspective
          (a Radix/shadcn animation wrapper, a future page transition,
          etc.), which silently turns "fixed" into "scrolls with the page."
          Portaling to body sidesteps that class of bug entirely instead of
          relying on every ancestor forever staying free of those
          properties. The content area carries a matching md:ml-56 offset
          (see ProjectsPage.tsx) since a fixed element is taken out of
          normal flow. */}
      {createPortal(
        <aside className="fixed inset-y-0 left-0 hidden h-screen w-56 shrink-0 bg-[#14151A] md:block">
          <NavList />
        </aside>,
        document.body
      )}

      {/* Mobile top bar + drawer */}
      <div className="mb-4 flex items-center justify-between bg-[#14151A] px-4 py-3 md:hidden">
        <img src={revhubLogo} alt="RevHub" className="h-5 w-auto" />
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button type="button" className="rounded-lg border border-white/15 p-2 text-white" aria-label="Open menu">
              <Menu size={18} />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 border-none bg-[#14151A] p-0">
            <div className="flex items-center justify-end px-3 pt-3">
              <button type="button" onClick={() => setMobileOpen(false)} className="rounded-lg p-1.5 text-white/50 hover:text-white" aria-label="Close menu">
                <X size={18} />
              </button>
            </div>
            <NavList onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default ProjectsSidebar;

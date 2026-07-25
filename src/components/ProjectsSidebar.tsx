import { useState } from "react";
import { Link } from "react-router-dom";
import { LayoutGrid, KanbanSquare, Users, LogOut, Menu, X, ArrowLeft } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export type ProjectsSection = "assignments" | "board" | "team";

type NavItem = {
  key: ProjectsSection;
  label: string;
  icon: typeof LayoutGrid;
};

const MEMBER_ITEMS: NavItem[] = [{ key: "assignments", label: "My assignments", icon: LayoutGrid }];

const OWNER_SHARED_ITEMS: NavItem[] = [{ key: "assignments", label: "My assignments", icon: LayoutGrid }];
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
};

// Wraps the existing /projects pages as navigation destinations rather than
// rebuilding their internals - a Member only ever sees "My assignments"
// (their outreach queue is the whole job), an Owner gets that plus Company
// board and Team below a divider, matching the trust boundary already
// enforced by the data layer (see fetchOwnerCompanyLeadFields and friends
// in projectContacts.ts) rather than inventing a second one here.
const ProjectsSidebar = ({ isOwner, activeSection, onSectionChange, memberName, onSignOut }: ProjectsSidebarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavList = ({ onNavigate }: { onNavigate?: () => void }) => (
    <div className="flex h-full flex-col">
      <div className="px-3 pb-6 pt-1">
        <p className="font-display text-lg font-extrabold tracking-tight text-foreground">RevHub</p>
        <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Outreach</p>
      </div>

      {/* Navbar's site-wide nav is gone from /projects (it's a standalone
          tool now, not a marketing page) - this is the one way back to
          aboutchad.com so nobody gets stranded. */}
      <div className="px-2 pb-4">
        <Link to="/" className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground no-underline hover:bg-[#F8FAFC] hover:text-primary">
          <ArrowLeft size={14} />
          aboutchad.com
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-2">
        <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Workflow</p>
        {(isOwner ? OWNER_SHARED_ITEMS : MEMBER_ITEMS).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => { onSectionChange(key); onNavigate?.(); }}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors ${
              activeSection === key ? "bg-primary/10 text-primary" : "text-[#334155] hover:bg-[#F8FAFC]"
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}

        {isOwner ? (
          <>
            <p className="px-2 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Owner only</p>
            {OWNER_ONLY_ITEMS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => { onSectionChange(key); onNavigate?.(); }}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors ${
                  activeSection === key ? "bg-primary/10 text-primary" : "text-[#334155] hover:bg-[#F8FAFC]"
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </>
        ) : null}
      </nav>

      <div className="mt-auto border-t border-[#E2E8F0] px-3 py-4">
        {memberName ? <p className="mb-2 truncate text-xs text-muted-foreground">Signed in as {memberName}</p> : null}
        <button
          type="button"
          onClick={onSignOut}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-semibold text-[#334155] hover:bg-[#F8FAFC]"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop rail */}
      <aside className="sticky top-0 hidden h-screen w-56 shrink-0 border-r border-[#E2E8F0] bg-white md:block">
        <NavList />
      </aside>

      {/* Mobile drawer */}
      <div className="mb-4 flex items-center justify-between md:hidden">
        <p className="font-display text-lg font-extrabold tracking-tight text-foreground">RevHub</p>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button type="button" className="rounded-lg border border-[#E2E8F0] p-2 text-[#334155]" aria-label="Open menu">
              <Menu size={18} />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <div className="flex items-center justify-end px-3 pt-3">
              <button type="button" onClick={() => setMobileOpen(false)} className="rounded-lg p-1.5 text-muted-foreground" aria-label="Close menu">
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

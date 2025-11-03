"use client";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Bell,
  Settings as SettingsIcon,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navSections = [
    {
      title: null,
      items: ["Dashboard", "Orders", "Tickets", "Clients"],
    },
    {
      title: "Billing",
      items: ["Invoices", "Subscriptions"],
    },
    {
      title: "Setup",
      items: ["Integrations", "Settings"],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900">
      <div className="flex">
        {/* Sidebar (md+) */}
        <aside className="w-64 min-h-screen bg-[#1E3A34] text-white sticky top-0 hidden md:flex flex-col">
          <div className="p-6 flex items-center gap-3 border-b border-white/6">
            <Image src="/logo.png" alt="Task-Era Logo" width={36} height={36} className="w-10 h-10 rounded-full object-cover" />
            <div>
              <h1 className="text-lg font-semibold">Task-Era</h1>
              <p className="text-xs text-white/70">Project Management</p>
            </div>
          </div>

          <nav className="p-4 flex-1 space-y-1 overflow-y-auto">
            {navSections.map((section, idx) => (
              <div key={idx}>
                {section.title && (
                  <div className="mt-6 pt-4 border-t border-white/6 text-xs text-white/70">{section.title}</div>
                )}
                {section.items.map((label) => (
                  <NavItem key={label} label={label} />
                ))}
              </div>
            ))}
          </nav>

          <div className="p-4 border-t border-white/6">
            <Button className="w-full" variant="secondary">
              Create Team
            </Button>
          </div>
        </aside>

        {/* Main area */}
        <div className="flex-1">
          {/* Topbar */}
          <header className="flex items-center justify-between gap-4 bg-white px-4 py-3 border-b">
            <div className="flex items-center gap-3">
              <button className="md:hidden p-2 rounded-md bg-white/50" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                <Menu className="w-5 h-5 text-slate-700" />
              </button>

              <div className="relative">
                <input
                  placeholder="Search..."
                  className="w-[560px] max-w-xs md:max-w-md lg:max-w-xl bg-slate-50 border rounded-md py-2 pl-10 pr-4 text-sm placeholder:text-slate-400"
                />
                <svg className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Bell className="w-5 h-5 text-slate-600" />
              <SettingsIcon className="w-5 h-5 text-slate-600" />

              {/* Profile dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative flex items-center gap-2 rounded-full bg-white p-0 text-sm focus:outline-none">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                      <AvatarFallback>{session?.user?.name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                    <span className="hidden lg:flex lg:items-center">
                      <span className="text-sm font-semibold leading-6 text-gray-900">{session?.user?.name}</span>
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={() => signOut({ callbackUrl: "/" })}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Content layout */}
          <main className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">{children}</div>

            <aside className="space-y-4">
              <div className="bg-white p-4 rounded-md shadow-sm">
                <h3 className="text-sm font-medium">Note</h3>
                <textarea className="w-full mt-2 p-2 rounded border text-sm h-24 resize-none" placeholder="Add note for your team..."></textarea>
              </div>

              <div className="bg-white p-4 rounded-md shadow-sm">
                <h4 className="text-sm font-semibold">Details</h4>
                <div className="mt-3 text-sm text-slate-600 space-y-2">
                  <Row label="Service" value="Starter Plan" />
                  <Row label="Client" value="Globex Industries" />
                  <Row label="Status" value={<StatusBadge label="Pending" variant="orange" />} />
                  <Row label="Assign To" value={<AssigneeList />} />
                </div>
              </div>

              <div className="bg-white p-4 rounded-md shadow-sm">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Invoice</h4>
                  <span className="text-sm text-green-600 font-semibold">Paid</span>
                </div>
                <div className="mt-3 text-sm text-slate-600">Amount</div>
                <div className="text-lg font-bold">$500.00</div>
              </div>
            </aside>
          </main>
        </div>
      </div>
    </div>
  );
}

/* Small helper components reused from TaskEraLayout */
function NavItem({ label }: { label: string }) {
  return (
    <div className="rounded-md px-3 py-2 hover:bg-white/6 cursor-pointer flex items-center gap-3">
      <div className="w-8 h-8 bg-white/6 rounded flex items-center justify-center text-sm">{label[0]}</div>
      <span className="text-sm">{label}</span>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="text-sm">{value}</div>
    </div>
  );
}

function StatusBadge({ label, variant = "green" }: { label: string; variant?: "green" | "orange" | "red" }) {
  const base = "inline-block px-2 py-1 text-xs font-semibold rounded";
  const cls = variant === "green" ? "bg-green-100 text-green-800" : variant === "orange" ? "bg-orange-100 text-orange-800" : "bg-red-100 text-red-800";
  return <span className={`${base} ${cls}`}>{label}</span>;
}

function AssigneeList() {
  return (
    <div className="flex items-center gap-2">
      <div className="text-xs px-2 py-1 rounded bg-slate-100">Jane Cooper</div>
      <div className="text-xs px-2 py-1 rounded bg-slate-100">Lipton Das</div>
    </div>
  );
}
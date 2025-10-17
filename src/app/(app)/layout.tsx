
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  User,
  HeartHandshake,
  BookUser,
  Users,
  Settings,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

const topNavItems = [
    { role: "educator", href: "/dashboard", label: "فضاء المرشد", icon: LayoutDashboard },
    { role: "teacher", href: "/teacher-space", label: "فضاء الأستاذ", icon: BookUser },
    { role: "student", href: "/student/2", label: "فضاء المتمدرس", icon: User },
    { role: "parent", href: "/parent-space", label: "فضاء الأولياء", icon: Users },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentUserRole, setCurrentUserRole] = React.useState('educator');

  React.useEffect(() => {
    const getCurrentRole = () => {
      if (pathname.startsWith('/dashboard')) return 'educator';
      if (pathname.startsWith('/teacher-space')) return 'teacher';
      if (pathname.startsWith('/student/')) return 'student';
      if (pathname.startsWith('/parent-space')) return 'parent';
      
      const roleFromParams = searchParams.get('role');
      if (roleFromParams) return roleFromParams;

      return 'educator'; 
    }
    setCurrentUserRole(getCurrentRole());
  }, [pathname, searchParams]);
  
  return (
    <div className="min-h-screen">
       <header className="sticky top-0 z-50 flex items-center justify-between p-4 h-20 gap-4 bg-transparent">
            <div className="flex items-center gap-4">
                <Link href="/" className="flex items-center gap-2">
                    <div className="bg-primary rounded-lg p-1.5 text-primary-foreground">
                        <HeartHandshake className="h-6 w-6" />
                    </div>
                </Link>
            </div>
            
            <ScrollArea className="w-full max-w-lg whitespace-nowrap">
              <Tabs value={currentUserRole} className="w-full">
                  <TabsList className="h-12">
                      {topNavItems.map(item => {
                          const studentId = pathname.startsWith('/student/') ? pathname.split('/')[2] : '2';
                          let href = item.href;
                          if (item.role === 'student') href = `/student/${studentId}`;

                          return (
                              <TabsTrigger key={item.role} value={item.role} asChild>
                                  <Link href={href} className="flex items-center gap-2">
                                      <item.icon className="w-4 h-4" />
                                      <span>{item.label}</span>
                                  </Link>
                              </TabsTrigger>
                          )
                      })}
                  </TabsList>
              </Tabs>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            
            <div className="flex items-center gap-4">
              <Button asChild variant="outline" size="icon" className="h-12 w-12 rounded-full">
                <Link href="/account-settings">
                  <Settings className="h-6 w-6" />
                  <span className="sr-only">Account Settings</span>
                </Link>
              </Button>
            </div>
      </header>
      <main className="flex-1">
        <div className="p-4 sm:p-6 lg:p-8">
            {children}
        </div>
      </main>
    </div>
  );
}

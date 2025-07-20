'use client';

import Link from 'next/link';
import { generateMainNav } from './nav';
import { DashboardPeriodSelect } from '../Dashboard/DashboardPeriodSelect';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const MainSidebar = () => {
  const [isCollapsed, setCollapsed] = useState<boolean>(false);
  const [isFixed, setIsFixed] = useState<boolean>(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const nav = generateMainNav();

  const handleFixeSidebar = (state: boolean) => setIsFixed(state);

  useEffect(() => {
    if (isFixed) {
      return;
    }

    const handleMouseIn = () => setCollapsed(false);
    const handleMouseOut = () => setCollapsed(true);

    const sidebar = sidebarRef.current;

    if (sidebar) {
      sidebar.addEventListener('mouseenter', handleMouseIn);
      sidebar.addEventListener('mouseleave', handleMouseOut);
    }

    return () => {
      if (sidebar) {
        sidebar.removeEventListener('mouseenter', handleMouseIn);
        sidebar.removeEventListener('mouseleave', handleMouseOut);
      }
    };
  }, [isFixed]);

  return (
    <aside
      ref={sidebarRef}
      className={cn(
        'bg-kdwa-background text-kdwa-foreground border-foreground/10 min-h-screen border-r transition-all',
        isCollapsed && 'w-14'
      )}
    >
      <nav className='relative flex flex-col items-center px-4'>
        <h1
          className={cn(
            'text-kdwa-foreground pt-2 text-center text-2xl font-bold',
            isCollapsed && 'py-4'
          )}
        >
          {isCollapsed ? 'K' : 'Kudwa App'}
        </h1>
        {!isCollapsed && (
          <Button
            className='my-4 size-6 cursor-pointer rounded-full'
            onClick={() => handleFixeSidebar(!isFixed)}
          >
            {isFixed ? (
              <ArrowLeft className='size-3' />
            ) : (
              <ArrowRight className='size-3' />
            )}
          </Button>
        )}
        <ul className='flex w-full flex-col items-center space-y-4'>
          {nav.map(({ title, href, icon: Icon }) => (
            <li key={href} className='mb-2 w-full'>
              <Link
                href={href}
                className={cn(
                  'flex h-12 w-full items-center gap-2 rounded-md text-lg',
                  isCollapsed ? 'justify-center' : 'p-2'
                )}
              >
                <Icon className={'size-4'} />
                {!isCollapsed && (
                  <p className='text-sm font-semibold'>{title}</p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

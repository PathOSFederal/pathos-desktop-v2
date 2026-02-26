'use client';

import { useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { NavigationProvider } from '@pathos/adapters';
import { useNextNavAdapter, NextNavLink } from '@/lib/adapters/next-nav-adapter';
import {
  SharedAppShell,
  DashboardScreen,
  PathAdvisorRail,
  type PathAdvisorMessage,
  type ThemeVariant,
} from '@pathos/ui';

const SIMULATED_REPLY =
  'Thanks for your question. This is a local-only preview—PathAdvisor will use your context when connected.';

function SharedDashboardShell(props: { themeVariant?: ThemeVariant }) {
  const [advisorMessages, setAdvisorMessages] = useState<PathAdvisorMessage[]>([]);

  const handleAdvisorSend = useCallback(function (text: string) {
    const userMessage: PathAdvisorMessage = { role: 'user', content: text };
    setAdvisorMessages(function (prev) {
      const next = [];
      for (let i = 0; i < prev.length; i++) {
        next.push(prev[i]);
      }
      next.push(userMessage);
      return next;
    });

    setTimeout(function () {
      const assistantMessage: PathAdvisorMessage = {
        role: 'assistant',
        content: SIMULATED_REPLY,
      };
      setAdvisorMessages(function (prev) {
        const next = [];
        for (let i = 0; i < prev.length; i++) {
          next.push(prev[i]);
        }
        next.push(assistantMessage);
        return next;
      });
    }, 600);
  }, []);

  return (
    <SharedAppShell
      platform="web"
      themeVariant={props.themeVariant}
      rightRail={
        <PathAdvisorRail
          dock="right"
          messages={advisorMessages}
          onSend={handleAdvisorSend}
        />
      }
      advisorDock="right"
    >
      <DashboardScreen />
    </SharedAppShell>
  );
}

export default function DashboardPage() {
  const adapter = useNextNavAdapter();
  const searchParams = useSearchParams();
  const themeParam = searchParams.get('theme');
  let themeVariant: ThemeVariant | undefined = undefined;
  if (themeParam === 'legacy' || themeParam === 'mix' || themeParam === 'shared') {
    themeVariant = themeParam;
  }

  return (
    <NavigationProvider adapter={adapter} linkComponent={NextNavLink}>
      <SharedDashboardShell themeVariant={themeVariant} />
    </NavigationProvider>
  );
}

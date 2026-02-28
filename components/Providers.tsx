'use client';

import { ThirdwebProvider } from "thirdweb/react";
import ErrorBoundary from "./ErrorBoundary";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <ThirdwebProvider>
        {children}
      </ThirdwebProvider>
    </ErrorBoundary>
  );
}

import { ReactNode } from 'react';
import Link from 'next/link';

export const docsComponents = {
  // callout boxes
  Callout: ({ type = 'info', children }: { type?: string; children: ReactNode }) => (
    <div className={`callout callout-${type}`}>{children}</div>
  ),

  // interlinear glosses
  Gloss: ({
    source,
    gloss,
    translation,
  }: {
    source: string;
    gloss: string;
    translation: string;
  }) => (
    <div className="gloss">
      <div className="gloss-line">{source}</div>
      <div className="gloss-line">{gloss}</div>
      <div className="gloss-translation">"{translation}"</div>
    </div>
  ),
};
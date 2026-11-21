import React, { useMemo } from 'react';
import katex from 'katex';

export default function MathView({ math, display = false, className = '' }) {
  const html = useMemo(() => {
    if (!math) return '';
    try {
      return katex.renderToString(math, {
        displayMode: display,
        throwOnError: false,
        output: 'htmlAndMathml',
      });
    } catch (err) {
      console.warn('KaTeX rendering error for:', math, err);
      return `<span class="katex-fallback font-mono">${math}</span>`;
    }
  }, [math, display]);

  if (!math) return null;

  return (
    <span
      className={`katex-render inline-block ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

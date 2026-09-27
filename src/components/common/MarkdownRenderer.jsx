import React from 'react';

/**
 * Lightweight and elegant Markdown renderer for club descriptions,
 * supporting headers (###), bold text (**text**), italics (*text*),
 * bullet lists (- / *), and paragraph breaks.
 */
export default function MarkdownRenderer({ content = '', className = '' }) {
  if (!content) return null;

  // Split by double newlines into blocks
  const blocks = content.split(/\n\s*\n/);

  return (
    <div className={`space-y-3 text-[#57534E] text-xs sm:text-sm leading-relaxed ${className}`}>
      {blocks.map((block, bIdx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Headings: ### or ## or #
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={bIdx} className="font-serif text-base sm:text-lg font-bold text-[#1C1917] mt-3 mb-1">
              {parseInlineMarkdown(trimmed.replace(/^###\s+/, ''))}
            </h4>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={bIdx} className="font-serif text-lg sm:text-xl font-bold text-[#1C1917] mt-4 mb-1">
              {parseInlineMarkdown(trimmed.replace(/^##\s+/, ''))}
            </h3>
          );
        }
        if (trimmed.startsWith('# ')) {
          return (
            <h2 key={bIdx} className="font-serif text-xl sm:text-2xl font-bold text-[#1C1917] mt-4 mb-2">
              {parseInlineMarkdown(trimmed.replace(/^#\s+/, ''))}
            </h2>
          );
        }

        // Bullet lists: lines starting with '-' or '*'
        const lines = trimmed.split('\n');
        const isList = lines.every((l) => /^\s*[-*•]\s+/.test(l));
        if (isList) {
          return (
            <ul key={bIdx} className="list-disc list-inside space-y-1 pl-1 text-[#57534E]">
              {lines.map((item, lIdx) => (
                <li key={lIdx} className="leading-relaxed">
                  {parseInlineMarkdown(item.replace(/^\s*[-*•]\s+/, ''))}
                </li>
              ))}
            </ul>
          );
        }

        // Standard Paragraph with lines
        return (
          <p key={bIdx} className="leading-relaxed">
            {lines.map((l, lIdx) => (
              <React.Fragment key={lIdx}>
                {parseInlineMarkdown(l)}
                {lIdx < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

function parseInlineMarkdown(text) {
  if (!text) return '';
  // Split by bold (**bold**) and italics (*italic*)
  const parts = [];
  let remaining = text;
  let key = 0;

  // Regex to match **bold** or *italic*
  const pattern = /(\*\*(.*?)\*\*|\*(.*?)\*)/g;
  let match;
  let lastIndex = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    if (match[2]) {
      // Bold
      parts.push(<strong key={key++} className="font-bold text-[#1C1917]">{match[2]}</strong>);
    } else if (match[3]) {
      // Italic
      parts.push(<em key={key++} className="italic text-[#44403C]">{match[3]}</em>);
    }
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

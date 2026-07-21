function renderGloss(gloss: string) {
  return gloss.split(/([-.\s]+)/).map((part, i) =>
    /^[A-Z0-9]*[A-Z][A-Z0-9]*$/.test(part) ? (
      <span key={i} className="smallcaps">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

export function Example({
  kawaba,
  gloss,
  translation,
}: {
  kawaba: string;
  gloss: string;
  translation: string;
}) {
  return (
    <div className="example">
      <p className="example-kawaba">{kawaba}</p>
      <p className="example-gloss">{renderGloss(gloss)}</p>
      <p className="example-translation">{translation}</p>
    </div>
  );
}

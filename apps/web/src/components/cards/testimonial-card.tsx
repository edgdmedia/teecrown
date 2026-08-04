interface TestimonialCardProps {
  rating?: number;
  text: string;
  name: string;
  title?: string;
}

export function TestimonialCard({ rating = 5, text, name, title }: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-[var(--radius-card)] p-12 shadow-[var(--shadow-card)] min-h-[280px] flex flex-col">
      <div className="text-[var(--tcc-star)] text-lg tracking-[2px] mb-4">
        {"★".repeat(rating)}{"☆".repeat(Math.max(0, 5 - rating))}
      </div>
      <p className="font-primary text-[15px] leading-relaxed text-[var(--tcc-text)] italic flex-1 mb-6">
        &ldquo;{text}&rdquo;
      </p>
      <div className="border-t border-[var(--tcc-border)] pt-4">
        <strong className="block text-sm text-[var(--tcc-navy)] font-bold">{name}</strong>
        {title && <span className="text-[13px] text-[var(--tcc-text-light)]">{title}</span>}
      </div>
    </div>
  );
}

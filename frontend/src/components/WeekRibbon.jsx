export default function WeekRibbon({ activeDay = null, size = 'md' }) {
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const dotSize = size === 'sm' ? 6 : 10;
    const gap = size === 'sm' ? 6 : 10;

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap }}>
            {days.map((_, i) => (
                <div
                    key={i}
                    style={{
                        width: dotSize,
                        height: dotSize,
                        borderRadius: '50%',
                        background: activeDay === i + 1 ? 'var(--color-accent)' : 'var(--color-primary)',
                        opacity: activeDay === null ? 0.25 + (i * 0.11) : (activeDay === i + 1 ? 1 : 0.25),
                        transition: 'opacity 0.3s ease, background 0.3s ease',
                    }}
                />
            ))}
        </div>
    );
}
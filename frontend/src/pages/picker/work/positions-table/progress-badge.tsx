export const ProgressBadge: React.FC<{pickedQuantity: number; totalQuantity: number}> = function ({
    pickedQuantity,
    totalQuantity
}) {
    const isCompleted = totalQuantity > 0 && pickedQuantity >= totalQuantity;
    const isPartial = pickedQuantity > 0 && !isCompleted;
    const badgeClass = isCompleted
        ? 'bg-success-subtle text-success-emphasis border border-success-subtle'
        : isPartial
          ? 'bg-warning-subtle text-warning-emphasis border border-warning-subtle'
          : 'text-bg-light text-body-emphasis';

    return <span className={`badge ${badgeClass}`}>{`${pickedQuantity}/${totalQuantity}`}</span>;
};

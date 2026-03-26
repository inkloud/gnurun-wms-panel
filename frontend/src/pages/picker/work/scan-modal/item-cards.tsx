import React from 'react';

export type ItemCard = {
    id: string;
    title: string;
    value: React.ReactNode;
    titleRight?: string;
    valueRight?: React.ReactNode;
    disabled?: boolean;
    onClick?: () => void;
};

export const ItemCardRow: React.FC<{item: ItemCard}> = function ({item}) {
    const isClickable = item.onClick !== undefined && item.disabled !== true;

    return (
        <div
            className={`card ${item.disabled === true ? 'opacity-50' : ''}`}
            style={{cursor: isClickable ? 'pointer' : 'default'}}
            onClick={isClickable ? item.onClick : undefined}
            aria-disabled={item.disabled === true}
        >
            <div className="card-body d-flex justify-content-between align-items-center py-2">
                <div className="d-flex flex-column">
                    <span className="text-uppercase text-muted small fw-semibold">{item.title}</span>
                    <span className="badge text-bg-light align-self-start">{item.value}</span>
                </div>
                {item.titleRight !== undefined && item.valueRight !== undefined ? (
                    <div className="text-end">
                        <span className="text-uppercase text-muted small d-block">{item.titleRight}</span>
                        <span className="fw-semibold fs-5">{item.valueRight}</span>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export const ItemCards: React.FC<React.PropsWithChildren> = function ({children}) {
    return <div className="d-flex flex-column gap-2">{children}</div>;
};

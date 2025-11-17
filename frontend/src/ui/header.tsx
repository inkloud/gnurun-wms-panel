export const Header: React.FC<{title: string; subtitle: string}> = function ({title, subtitle}) {
    return (
        <header className="mb-4">
            <h1 className="h2 mb-1 text-dark">{title}</h1>
            <p className="text-muted mb-0">{subtitle}</p>
        </header>
    );
};

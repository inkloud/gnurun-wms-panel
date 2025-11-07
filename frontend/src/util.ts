export const formatOrderDate = function (date: Date, locales?: Intl.LocalesArgument): string {
    return date.toLocaleString(locales, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });
};

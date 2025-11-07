export const formatOrderDate = function (date: Date, locales?: Intl.LocalesArgument): string {
    return date.toLocaleDateString(locales, {year: 'numeric', month: 'short', day: 'numeric'});
};

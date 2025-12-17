import truncate from "lodash/truncate";

export function excerpt(string) {
    return truncate(string, {
        length: 400, // maximum 400 characters
        separator: /,?\.* +/, // separate by spaces, including preceding commas and periods
    });
}

// Returns today's date in the user's local timezone as YYYY-MM-DD
export function todayLocalISODate() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Format a release date from YYYY-MM-DD to "07 Nov 2025".
export function formatReleaseDate(dateString, locale = 'en-GB') {
    if (!dateString) return null;
    try {
        
        const d = new Date(dateString);
        if (Number.isNaN(d.getTime())) return null;
        return new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'short', year: 'numeric' }).format(d);
    } catch {
        return null;
    }
}


export function formatBirthDate(dateString, locale = 'en-GB') {
    if (!dateString) return 'N/A';
    try {
        const d = new Date(dateString);
        if (Number.isNaN(d.getTime())) return 'N/A';

        const formatted = new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'long', year: 'numeric' }).format(d);

        // calculate age
        const today = new Date();
        let age = today.getFullYear() - d.getFullYear();
        const m = today.getMonth() - d.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < d.getDate())) {
            age -= 1;
        }

        return `${formatted} (${age} years old)`;
    } catch {
        return 'N/A';
    }
}

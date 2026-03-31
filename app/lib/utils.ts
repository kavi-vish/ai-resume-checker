export function formatSize(bytes: number): string {
    if (!Number.isFinite(bytes) || bytes <= 0) {
        return "0 KB";
    }

    const units = ["KB", "MB", "GB"] as const;
    const base = 1024;

    let value = bytes / base;
    let unitIndex = 0;

    while (value >= base && unitIndex < units.length - 1) {
        value /= base;
        unitIndex += 1;
    }

    const formattedValue =
        value >= 100 ? value.toFixed(0) : value >= 10 ? value.toFixed(1) : value.toFixed(2);

    return `${Number(formattedValue)} ${units[unitIndex]}`;
}
export const generateUUID=()=>crypto.randomUUID();

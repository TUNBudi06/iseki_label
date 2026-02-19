export function formatCode10(s: string): string {
    let length = s.length;
    console.log(length);
    if (length === 10) {
        return s.replace(/^(.{4})(.{3})(.{3})$/, '$1-$2-$3');
    } else if (length === 12) {
        return s.replace(/^(.{4})(.{3})(.{3})(.{2})$/, '$1-$2-$3-$4');
    } else if (length === 13) {
        return s.replace(/^(.{4})(.{3})(.{3})(.{3})$/, '$1-$2-$3-$4');
    } else {
        return s.replace(/^(.)(.{4})(.{3})(.{3})$/, '$1-$2-$3-$4');
    }
}

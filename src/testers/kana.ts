const finalCharacters = [
    0x3063, 0x3093, // ん, っ
    0x30C3, 0x30F3, // ッ ,ン
    0x1B11D, 0x1B11E, // hentaigana(ん) �, �
    0xFF9D, // half-width ﾝ
];

const ranges: Array<[number, number]> = [
    [0x3041, 0x3096], // hirakana
    [0x30A0, 0x30FA], // katakana
    [0x1B000, 0x1B11C], // hentaigana
    [0x31F0, 0x31FF], // katakana extensions
    [0xFF66, 0xFF9C], // half-width katakana
    [0x3099, 0x309F], // voiced / semi-voiced mark
];

export default function TestKana(str: string) {
    const lastChar = str.charCodeAt(str.length - 1);
    if (
        lastChar === 0xFF9E || lastChar === 0xFF9F
     ) {
        return null;
    }

    if (finalCharacters.indexOf(lastChar) !== -1) {
        return true;
    }

    for (const range of ranges) {
        if (lastChar >= range[0] && lastChar <= range[1]) {
            return false;
        }
    }

    return undefined;
}

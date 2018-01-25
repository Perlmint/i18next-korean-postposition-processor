export default function TestKana(str: string) {
    const lastChar = str.charCodeAt(str.length - 1);
    if (
        lastChar === 0xFF9E || lastChar === 0xFF9F
     ) {
        return null;
    }

    if (
        lastChar === 0x3093 || lastChar === 0x3063 || // ん, っ
        lastChar === 0x30C3 || lastChar === 0x30F3 || // ッ ,ン
        lastChar === 0x1B11D || lastChar === 0x1B11E || // hentaigana(ん) �, �
        lastChar === 0xFF9D // half-width ﾝ
    ) {
        return true;
    }

    if (
        (lastChar >= 0x3041 && lastChar <= 0x3096) || // hirakana
        (lastChar >= 0x30A0 && lastChar <= 0x30FA) || // katakana
        (lastChar >= 0x1B000 && lastChar <= 0x1B11C) || // hentaigana
        (lastChar >= 0x31F0 && lastChar <= 0x31FF) || // katakana extensions
        (lastChar >= 0xFF66 && lastChar <= 0xFF9C) || // half-width katakana
        (lastChar >= 0x3099 && lastChar <= 0x309F) // voiced / semi-voiced mark
    ) {
        return false;
    }

    return undefined;
}

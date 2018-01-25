export default function TestHangul(str: string) {
    const lastChar = str.charCodeAt(str.length - 1);
    // complete hangul
    if (lastChar >= 44032 && lastChar <= 55203) {
        const final = (lastChar - 44032) % 28;
        return final !== 0;
    }

    return undefined;
}

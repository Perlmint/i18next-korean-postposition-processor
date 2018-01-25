export default function TestNumber(str: string) {
    let idx = str.length - 1;
    switch (str[idx]) {
        case "1":
        case "3":
        case "6":
        case "7":
        case "8":
            return true;
        case "2":
        case "4":
        case "5":
        case "9":
            return false;
        case "0":
            break;
        default:
            return undefined;
    }

    let zeroContinued = true;
    let zeroCount = 0;
    for (; idx > 0; idx--) {
        const ch = str[idx];
        if (zeroContinued) {
            if (ch === "0") {
                zeroCount++;
            } else if (ch === ",") {
                // decimal separator
                // just ignore it
                continue;
            } else if (ch === ".") {
                // found floating point before continued zeros
                // read as "영"
                return true;
            } else {
                zeroContinued = false;
            }
        } else if (ch === ".") {
            return true;
        }
    }

    // 12 - 조, 20 - 해, 24 - 자, 32 - 구, 44 - 재, >=52 - 항하사, 아승기, 나유타, 불가사의, 무량대수
    if (
        zeroCount === 12 || zeroCount === 20 || zeroCount === 24 ||
        zeroCount === 32 || zeroCount === 44 || zeroCount >= 52
    ) {
        return false;
    } else {
        return true;
    }
}

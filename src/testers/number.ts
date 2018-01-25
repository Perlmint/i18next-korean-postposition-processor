export default function TestNumber(str: string) {
    switch (str[str.length - 1]) {
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

    return TestNumberEndsWithZero(str);
}

function TestNumberEndsWithZero(str: string) {
    let idx = str.length - 1;
    let zeroContinued = true;
    let zeroCount = 0;
    for (; idx > 0; idx--) {
        const ch = str[idx];
        if (ch === ".") {
            // found floating point before continued zeros
            // read as "영"
            return true;
        }

        if (zeroContinued) {
            if (ch === "0") {
                zeroCount++;
            } else if (ch === ",") {
                // decimal separator
                // just ignore it
                continue;
            } else {
                zeroContinued = false;
            }
        }
    }

    return TestLargeNumberPostfix(zeroCount);
}

function TestLargeNumberPostfix(zeroCount: number) {
    // 12 - 조, 20 - 해, 24 - 자, 32 - 구, 44 - 재
    const counts = [12, 20, 24, 32, 44];
    // >=52 - 항하사, 아승기, 나유타, 불가사의, 무량대수
    if (
        counts.indexOf(zeroCount) !== -1 || zeroCount >= 52
    ) {
        return false;
    } else {
        return true;
    }
}

export default function ParenthesisModifier(str: string) {
    const stack: number[] = [];
    let idx = str.length - 1;

    for (; idx > 0; idx--) {
        const ch = str[idx];
        if (ch === ")") {
            stack.push(idx);
        } else if (ch === "(") {
            stack.pop();
        } else if (stack.length === 0) {
            return str.substring(0, idx + 1);
        }
    }

    return str.substr(0, stack[stack.length - 1]);
}

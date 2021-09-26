import "mocha";
import { assert } from "chai";
import { KoreanPostpositionProcessor, default_testers, default_modifiers } from "../src";

describe("Postposition rocessor", () => {
    it("should not replace non-placeholder text", () => {
        const processor = new KoreanPostpositionProcessor();

        assert.equal(processor.process("마음속에 찰랑이는 맑고 고운 말 한마디"), "마음속에 찰랑이는 맑고 고운 말 한마디");
    });

    it("should use fallback when proper postposition is not inferrerble", () => {
        const processor = new KoreanPostpositionProcessor();

        assert.equal(processor.process("哈[[는]]"), "哈는");
        assert.equal(processor.process("哈[[은]]"), "哈은");
    });

    it("should use specified custom tester", () => {
        const processor = new KoreanPostpositionProcessor();

        const thinkingFaceTester = (str: string) => {
            return str === "🤔";
        };
        assert.equal(processor.process("🤔[[가]]"), "🤔가");
        processor.testers.push(thinkingFaceTester);
        assert.equal(processor.process("🤔[[가]]"), "🤔이");
        processor.testers.pop();
        assert.equal(processor.process("🤔[[가]]"), "🤔가");

        const overrideTester = (str: string) => {
            return str === "1" ? false : undefined;
        };
        assert.equal(processor.process("1[[가]]"), "1이");
        processor.testers.push(overrideTester);
        assert.equal(processor.process("1[[가]]"), "1이");
        processor.testers.unshift(overrideTester);
        assert.equal(processor.process("1[[가]]"), "1가");
    });

    it("should use custom modifier for inferring postposition", () => {
        const processor = new KoreanPostpositionProcessor();

        // simplified dummy html tag remover
        const htmlModifier = (str: string) => {
            const stack: number[] = [];
            let idx = str.length - 1;

            for (; idx > 0; idx--) {
                const ch = str[idx];
                if (ch === ">") {
                    stack.push(idx);
                } else if (ch === "<") {
                    stack.pop();
                } else if (stack.length === 0) {
                    return str.substring(0, idx + 1);
                }
            }

            return str.substr(0, stack[stack.length - 1]);
        };
        assert.equal(processor.process("<b>레드벨벳</b>[[가]]"), "<b>레드벨벳</b>가");
        processor.modifiers.push(htmlModifier);
        assert.equal(processor.process("<b>레드벨벳</b>[[가]]"), "<b>레드벨벳</b>이");
        processor.modifiers.pop();
        assert.equal(processor.process("<b>레드벨벳</b>[[가]]"), "<b>레드벨벳</b>가");
    });

    it("should have specified options", () => {
        const processor1 = new KoreanPostpositionProcessor();
        assert.deepEqual(processor1.testers, default_testers);
        assert.deepEqual(processor1.modifiers, default_modifiers);

        const processor2 = new KoreanPostpositionProcessor({});
        assert.deepEqual(processor2.testers, default_testers);
        assert.deepEqual(processor2.modifiers, default_modifiers);

        const processor3 = new KoreanPostpositionProcessor({
            testers: [],
        });
        assert.deepEqual(processor3.testers, []);
        assert.deepEqual(processor3.modifiers, default_modifiers);

        const processor4 = new KoreanPostpositionProcessor({
            modifiers: [],
        });
        assert.deepEqual(processor4.testers, default_testers);
        assert.deepEqual(processor4.modifiers, []);
    });

    it("should handle 이/가 properly", () => {
        const processor = new KoreanPostpositionProcessor();

        assert.equal(processor.process("자체[[가]]"), "자체가");
        assert.equal(processor.process("사고방식[[가]]"), "사고방식이");

        assert.equal(processor.process("계획[[이]]"), "계획이");
        assert.equal(processor.process("모두[[이]]"), "모두가");
    });

    it("should handle 은/는 properly", () => {
        const processor = new KoreanPostpositionProcessor();

        assert.equal(processor.process("한강[[은]]"), "한강은");
        assert.equal(processor.process("마포대교[[은]]"), "마포대교는");

        assert.equal(processor.process("본체[[는]]"), "본체는");
        assert.equal(processor.process("사진[[는]]"), "사진은");
    });

    it("should handle 을/를 properly", () => {
        const processor = new KoreanPostpositionProcessor();

        assert.equal(processor.process("몸[[을]]"), "몸을");
        assert.equal(processor.process("글래스고[[을]]"), "글래스고를");

        assert.equal(processor.process("마음[[를]]"), "마음을");
        assert.equal(processor.process("화장지[[를]]"), "화장지를");
    });

    it("should handle 으로/로 properly", () => {
        const processor = new KoreanPostpositionProcessor();

        assert.equal(processor.process("미술관[[으로]]"), "미술관으로");
        assert.equal(processor.process("키보드[[으로]]"), "키보드로");

        assert.equal(processor.process("사각형[[로]]"), "사각형으로");
        assert.equal(processor.process("머리[[로]]"), "머리로");
    });

    it("should handle 와/과 properly", () => {
        const processor = new KoreanPostpositionProcessor();

        assert.equal(processor.process("비트코인[[와]]"), "비트코인과");
        assert.equal(processor.process("정서[[와]]"), "정서와");

        assert.equal(processor.process("단어[[과]]"), "단어와");
        assert.equal(processor.process("자연[[과]]"), "자연과");
    });

    it("should handle 이랑/랑 properly", () => {
        const processor = new KoreanPostpositionProcessor();

        assert.equal(processor.process("파랑새[[이랑]]"), "파랑새랑");
        assert.equal(processor.process("밥[[이랑]]"), "밥이랑");

        assert.equal(processor.process("책상[[랑]]"), "책상이랑");
        assert.equal(processor.process("의자[[랑]]"), "의자랑");
    });

    it("should replace all postposition placeholders in single text", () => {
        const processor = new KoreanPostpositionProcessor();

        assert.equal(processor.process("햇빛[[가]] 선명하게 나뭇잎[[를]] 핥고 있었다"), "햇빛이 선명하게 나뭇잎을 핥고 있었다");
        assert.equal(processor.process("꽃씨들[[은]] 흙[[을]] 뚫고 얼음[[을]] 뚫고"), "꽃씨들은 흙을 뚫고 얼음을 뚫고");
        assert.equal(processor.process("연꽃 같[[은]] 팔꿈치[[으로]] 가이 없는 바다[[를]] 밟고"), "연꽃 같은 팔꿈치로 가이 없는 바다를 밟고");
        assert.equal(processor.process("이 많[[는]] 별빛[[이]] 내린 언덕 위에"), "이 많은 별빛이 내린 언덕 위에");
        assert.equal(processor.process("울림[[이]] 있어야 삶[[이]] 신선하고 활기차다"), "울림이 있어야 삶이 신선하고 활기차다");
    });

    it("should recognize arabic number and handle it in korean pronounciation", () => {
        const processor = new KoreanPostpositionProcessor();

        assert.equal(processor.process("10[[이]]"), "10이"); // 십이
        assert.equal(processor.process("2[[은]]"), "2는"); // 이는
        assert.equal(processor.process("1[[은]]"), "1은"); // 일은
        assert.equal(processor.process("1000000000000[[은]]"), "1000000000000는"); // 일조는
        assert.equal(processor.process("1,000,000,000,000[[은]]"), "1,000,000,000,000는"); // 일조는
        assert.equal(processor.process("1000.000[[는]]"), "1000.000은"); // 천점영영영은
        assert.equal(processor.process("99.990[[는]]"), "99.990은"); // 구십구점구구영은
    });

    it("should handle kana characters", () => {
        const processor = new KoreanPostpositionProcessor();

        assert.equal(processor.process("さくら[[이]]"), "さくら가");
        assert.equal(processor.process("パソコン[[이]]"), "パソコン이");
    });

    it("should ignore parenthesis", () => {
        const processor = new KoreanPostpositionProcessor();

        // there is no text before paren, use text in the paren.
        assert.equal(processor.process("(자살각)[[가]]"), "(자살각)이");
        // commonly ignore contents in paren.
        assert.equal(processor.process("니체(독일의 철학자)[[은]] 이렇게 말했다."), "니체(독일의 철학자)는 이렇게 말했다.");
    });
});

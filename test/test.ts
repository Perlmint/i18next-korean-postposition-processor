import "mocha";
import { assert } from "chai";
import processor, { appendTester, removeTester } from "../src";
const process = processor.process;

describe("basic replacement test", () => {
    it("none", () => {
        assert.equal(process("마음속에 찰랑이는 맑고 고운 말 한마디"), "마음속에 찰랑이는 맑고 고운 말 한마디");
    });

    it("fallback", () => {
        assert.equal(process("哈[[는]]"), "哈는");
        assert.equal(process("哈[[은]]"), "哈은");
    });

    it("custom tester", () => {
        const thinkingFaceTester = (str: string) => {
            return str === "🤔";
        };
        assert.equal(process("🤔[[가]]"), "🤔가");
        appendTester(thinkingFaceTester);
        assert.equal(process("🤔[[가]]"), "🤔이");
        removeTester(thinkingFaceTester);
        assert.equal(process("🤔[[가]]"), "🤔가");

        const overrideTester = (str: string) => {
            return str === "1" ? false : undefined;
        };
        assert.equal(process("1[[가]]"), "1이");
        appendTester(overrideTester);
        assert.equal(process("1[[가]]"), "1이");
        appendTester(overrideTester, true);
        assert.equal(process("1[[가]]"), "1가");
        removeTester(overrideTester);
    });

    it("이/가", () => {
        assert.equal(process("자체[[가]]"), "자체가");
        assert.equal(process("사고방식[[가]]"), "사고방식이");

        assert.equal(process("계획[[이]]"), "계획이");
        assert.equal(process("모두[[이]]"), "모두가");
    });

    it("은/는", () => {
        assert.equal(process("한강[[은]]"), "한강은");
        assert.equal(process("마포대교[[은]]"), "마포대교는");

        assert.equal(process("본체[[는]]"), "본체는");
        assert.equal(process("사진[[는]]"), "사진은");
    });

    it("을/를", () => {
        assert.equal(process("몸[[을]]"), "몸을");
        assert.equal(process("글래스고[[을]]"), "글래스고를");

        assert.equal(process("마음[[를]]"), "마음을");
        assert.equal(process("화장지[[를]]"), "화장지를");
    });

    it("으로/로", () => {
        assert.equal(process("미술관[[으로]]"), "미술관으로");
        assert.equal(process("키보드[[으로]]"), "키보드로");

        assert.equal(process("사각형[[로]]"), "사각형으로");
        assert.equal(process("머리[[로]]"), "머리로");
    });

    it("와/과", () => {
        assert.equal(process("비트코인[[와]]"), "비트코인과");
        assert.equal(process("정서[[와]]"), "정서와");

        assert.equal(process("단어[[과]]"), "단어와");
        assert.equal(process("자연[[과]]"), "자연과");
    });

    it("이랑/랑", () => {
        assert.equal(process("파랑새[[이랑]]"), "파랑새랑");
        assert.equal(process("밥[[이랑]]"), "밥이랑");

        assert.equal(process("책상[[랑]]"), "책상이랑");
        assert.equal(process("의자[[랑]]"), "의자랑");
    });

    it("multiple", () => {
        assert.equal(process("햇빛[[가]] 선명하게 나뭇잎[[를]] 핥고 있었다"), "햇빛이 선명하게 나뭇잎을 핥고 있었다");
        assert.equal(process("꽃씨들[[은]] 흙[[을]] 뚫고 얼음[[을]] 뚫고"), "꽃씨들은 흙을 뚫고 얼음을 뚫고");
        assert.equal(process("연꽃 같[[은]] 팔꿈치[[으로]] 가이 없는 바다[[를]] 밟고"), "연꽃 같은 팔꿈치로 가이 없는 바다를 밟고");
        assert.equal(process("이 많[[는]] 별빛[[이]] 내린 언덕 위에"), "이 많은 별빛이 내린 언덕 위에");
        assert.equal(process("울림[[이]] 있어야 삶[[이]] 신선하고 활기차다"), "울림이 있어야 삶이 신선하고 활기차다");
    });

    it("number", () => {
        assert.equal(process("10[[이]]"), "10이");
        assert.equal(process("2[[은]]"), "2는");
        assert.equal(process("1[[은]]"), "1은");
        assert.equal(process("1000000000000[[은]]"), "1000000000000는");
        assert.equal(process("1,000,000,000,000[[은]]"), "1,000,000,000,000는");
        assert.equal(process("1000.000[[는]]"), "1000.000은");
        assert.equal(process("99.990[[는]]"), "99.990은");
    });

    it("kana", () => {
        assert.equal(process("さくら[[이]]"), "さくら가");
        assert.equal(process("パソコン[[이]]"), "パソコン이");
    });

    it("ignore parenthesis", () => {
        // there is no text before paren, use text in the paren.
        assert.equal(process("(자살각)[[가]]"), "(자살각)이");
        // commonly ignore contents in paren.
        assert.equal(process("니체(독일의 철학자)[[은]] 이렇게 말했다."), "니체(독일의 철학자)는 이렇게 말했다.");
    });
});

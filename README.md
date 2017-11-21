# i18next-korean-postposition-processor

i18next post-processor for processing korean postposition - `을/를`, `이/가`, `은/는`, `으로/로`, `과/와`.

This processor can handle korean character or arabic number(without decimal mark).

## Setup

```javascript
import KoreanPostProcessor from 'i18next-korean-postposition-processor';

i18next.use(KoreanPostProcessor);
```

## Translation text
```
{{some_value}}[[를]] 수정했다.
```
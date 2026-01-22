# Task: Batch Generate Word MDX Files

## Objective

Traverse the word list in `scripts/extracted-words-v1-cp.json` and generate corresponding MDX files in `src/content/docs/words/` directory. Each MDX file should follow the structure and content pattern of `src/content/docs/words/better.mdx`.

## Input Data

- **Source File**: `scripts/extracted-words-v1-cp.json`
- **Data Structure**: 
  ```json
  {
    "count": 2459,
    "words": ["word1", "word2", "word3", ...]
  }
  ```
- **Total Words**: ~2459 words

## Output Requirements

### File Naming Rules

1. **Lowercase Only**: All MDX filenames must be lowercase (e.g., `better.mdx`, `abandon.mdx`)
2. **Skip Multi-word Entries**: If a word contains spaces (e.g., "word family"), skip it entirely
3. **Output Directory**: `src/content/docs/words/`

### MDX File Structure

Each MDX file must follow this exact structure (refer to `better.mdx`):

```mdx
---
title: [Word with First Letter Capitalized]
description: [Brief definition in Chinese]
sidebar:
  hidden: true
tableOfContents: false
---

import Pronunciation from "../../../components/Pronunciation.svelte";
import WordRelations from "../../../components/WordRelations.svelte";

### 分析词义

[Detailed explanation in Chinese about the word's meaning, part of speech, and usage]

<Pronunciation word="[Word]" uk="[UK phonetic]" us="[US phonetic]" client:only />

### 列举例句

1. "[English example sentence]" ([Chinese translation])
2. "[English example sentence]" ([Chinese translation])
3. "[English example sentence]" ([Chinese translation])

### 词根分析

[Etymology and word root analysis in Chinese]

### 词缀分析

[Prefix, suffix, and affix analysis in Chinese, or state "无前缀和后缀" if none]

### 文化背景

[Cultural context, origin, and usage in Western culture, in Chinese]

### 单词变形

- 固定搭配: "[collocation 1]" ([Chinese]), "[collocation 2]" ([Chinese])
- [Other relevant forms: plurals, verb forms, etc. if applicable]

### 记忆辅助

[Memory technique or mnemonic in Chinese]

### 助记故事

"[Short story in English using the word]" ([Chinese translation])

<WordRelations
  synonyms={["synonym1", "synonym2", "synonym3"]}
  antonyms={["antonym1", "antonym2"]}
  client:only
/>
```

**IMPORTANT**: 
- If there are NO synonyms AND NO antonyms, **DO NOT include** the `<WordRelations>` component at all
- Also **DO NOT import** `WordRelations` if it won't be used

## Data Acquisition Strategy

### 1. API-Based Data (Primary Source)

**API Endpoint**: `https://api.dictionaryapi.dev/api/v2/entries/en/{word}`

**Request Example**:
```
GET https://api.dictionaryapi.dev/api/v2/entries/en/better
```

**Extract These Fields**:

- **Phonetics**:
  - `phonetics[0].text` → UK pronunciation (IPA format)
  - `phonetics[1].text` → US pronunciation (IPA format)
  - If only one phonetic exists, use it for both UK and US
  - If array index doesn't exist, fall back to AI generation

- **Synonyms**: 
  - Check `meanings[*].synonyms[]` arrays
  - Collect unique synonyms from all meanings
  - Select 3-5 most relevant synonyms

- **Antonyms**:
  - Check `meanings[*].antonyms[]` arrays
  - Collect unique antonyms from all meanings
  - Select 2-4 most relevant antonyms

**Error Handling**:
- If API returns 404 or fails, proceed to AI generation
- Network timeout: 10 seconds
- Retry once if network error occurs

### 2. AI Generation (Fallback)

When API data is unavailable or incomplete:

- **Phonetics**: Generate standard IPA phonetic notation based on English pronunciation rules
- **Synonyms**: Generate 3-5 contextually appropriate synonyms
- **Antonyms**: Generate 2-4 contextually appropriate antonyms
- **Rule**: If NO synonyms AND NO antonyms exist (neither from API nor AI), omit `WordRelations` component entirely

### 3. AI-Generated Content (Always Required)

Generate the following sections with high-quality Chinese explanations:

1. **Title & Description**: Word with definition
2. **分析词义**: Detailed meaning, part of speech, usage scenarios
3. **列举例句**: 3 practical English sentences with Chinese translations
4. **词根分析**: Etymology, word roots, historical development
5. **词缀分析**: Prefixes, suffixes, or state if none exist
6. **文化背景**: Cultural context, origin stories, usage in Western culture
7. **单词变形**: Common collocations, fixed phrases, grammatical variations
8. **记忆辅助**: Creative mnemonic techniques
9. **助记故事**: A short, memorable story in English with Chinese translation

## Batch Processing Logic

### Processing Flow

1. **Read** `scripts/extracted-words-v1-cp.json`
2. **Extract** first 100 words from the `words` array
3. **For each word**:
   - Check if word contains spaces → Skip if yes
   - Check if MDX file already exists → Skip if yes
   - Fetch data from Dictionary API
   - Generate AI content for all required sections
   - Create MDX file with lowercase filename
   - Log result (success/skip/error)
4. **Update JSON file**:
   - Remove processed 100 words from the array
   - Update `count` field
   - Save back to `scripts/extracted-words-v1-cp.json`
5. **Generate log file**: Append to `scripts/word-generation-log.txt`
6. **Repeat** until all words are processed

### Batch Size

- **100 words per batch**
- After each batch, update the source JSON file
- This allows resumption if the process is interrupted

## Logging Requirements

Create/append to `scripts/word-generation-log.txt` with this format:

```
=== Batch [N] - [Timestamp] ===
Total in batch: 100
Processed: 95
Skipped (multi-word): 3
Skipped (exists): 2
Errors: 0
Words: word1, word2, word3, ...
---
```

**Log Details**:
- Timestamp in ISO format
- Count of processed, skipped, and error words
- List all words in the batch
- Separate batches with `---`

## Quality Standards

### Content Quality

1. **Chinese Explanations**: Clear, accurate, educational
2. **Example Sentences**: Natural, practical, varied contexts
3. **Etymology**: Factually accurate when possible
4. **Memory Techniques**: Creative and helpful
5. **Stories**: Engaging, appropriate for language learners

### Technical Quality

1. **MDX Syntax**: Valid, no syntax errors
2. **Component Usage**: Correct props and client directives
3. **Frontmatter**: Complete and properly formatted
4. **File Naming**: Strictly lowercase, no special characters

## Edge Cases

1. **Single phonetic from API**: Use same value for both UK and US
2. **No synonyms or antonyms**: Omit `WordRelations` component entirely AND its import
3. **Multi-word entries**: Skip completely (don't create file, log as skipped)
4. **Existing files**: Skip, log as "already exists"
5. **API rate limiting**: Implement 1-second delay between API calls
6. **Invalid JSON response**: Fall back to AI generation

## Example Reference

See `src/content/docs/words/better.mdx` for the complete template and content style.

## Success Criteria

- All single-word entries have corresponding MDX files
- All files follow the exact structure and format
- Source JSON is updated after each batch
- Complete processing log is generated
- No syntax errors in generated MDX files
- High-quality, educational Chinese content

/**
 * Case conversion utility functions
 * Converts text between different naming conventions
 */

/**
 * Splits a string into words, handling various separators and case changes
 */
function splitIntoWords(text: string): string[] {
  if (!text) return [];

  // Handle camelCase, PascalCase, snake_case, kebab-case
  return text
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Split camelCase/PascalCase
    .replace(/[_-]/g, " ") // Replace underscores and hyphens with spaces
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);
}

/**
 * Converts text to camelCase
 * Example: "hello world" -> "helloWorld"
 */
export function toCamelCase(text: string): string {
  const words = splitIntoWords(text);
  if (words.length === 0) return "";

  return (
    words[0].toLowerCase() +
    words
      .slice(1)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join("")
  );
}

/**
 * Converts text to PascalCase
 * Example: "hello world" -> "HelloWorld"
 */
export function toPascalCase(text: string): string {
  const words = splitIntoWords(text);
  if (words.length === 0) return "";

  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}

/**
 * Converts text to snake_case
 * Example: "hello world" -> "hello_world"
 */
export function toSnakeCase(text: string): string {
  const words = splitIntoWords(text);
  return words.join("_");
}

/**
 * Converts text to kebab-case
 * Example: "hello world" -> "hello-world"
 */
export function toKebabCase(text: string): string {
  const words = splitIntoWords(text);
  return words.join("-");
}

/**
 * Converts text to UPPER_SNAKE_CASE
 * Example: "hello world" -> "HELLO_WORLD"
 */
export function toUpperSnakeCase(text: string): string {
  const words = splitIntoWords(text);
  return words.map((word) => word.toUpperCase()).join("_");
}

/**
 * Converts text to Sentence case
 * Example: "hello world" -> "Hello world"
 */
export function toSentenceCase(text: string): string {
  const words = splitIntoWords(text);
  if (words.length === 0) return "";

  return (
    words[0].charAt(0).toUpperCase() +
    words[0].slice(1).toLowerCase() +
    " " +
    words.slice(1).join(" ")
  );
}

/**
 * Converts text to Title Case
 * Example: "hello world" -> "Hello World"
 */
export function toTitleCase(text: string): string {
  const words = splitIntoWords(text);
  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Converts text to lowercase
 * Example: "Hello World" -> "hello world"
 */
export function toLowerCase(text: string): string {
  return text.toLowerCase();
}

/**
 * Converts text to UPPERCASE
 * Example: "hello world" -> "HELLO WORLD"
 */
export function toUpperCase(text: string): string {
  return text.toUpperCase();
}

/**
 * Converts text to CONSTANT_CASE (alias for toUpperSnakeCase)
 * Example: "hello world" -> "HELLO_WORLD"
 */
export function toConstantCase(text: string): string {
  return toUpperSnakeCase(text);
}

/**
 * Converts text to dot.case
 * Example: "hello world" -> "hello.world"
 */
export function toDotCase(text: string): string {
  const words = splitIntoWords(text);
  return words.join(".");
}

/**
 * Converts text to path/case
 * Example: "hello world" -> "hello/world"
 */
export function toPathCase(text: string): string {
  const words = splitIntoWords(text);
  return words.join("/");
}

/**
 * All available case conversion functions
 */
export const caseConverters = {
  camelCase: toCamelCase,
  PascalCase: toPascalCase,
  snake_case: toSnakeCase,
  "kebab-case": toKebabCase,
  UPPER_SNAKE_CASE: toUpperSnakeCase,
  "Sentence case": toSentenceCase,
  "Title Case": toTitleCase,
  lowercase: toLowerCase,
  UPPERCASE: toUpperCase,
  CONSTANT_CASE: toConstantCase,
  "dot.case": toDotCase,
  "path/case": toPathCase,
} as const;

/**
 * Type for case converter names
 */
export type CaseConverterName = keyof typeof caseConverters;

/**
 * Converts text to a specific case format
 */
export function convertCase(text: string, caseType: CaseConverterName): string {
  const converter = caseConverters[caseType];
  return converter ? converter(text) : text;
}

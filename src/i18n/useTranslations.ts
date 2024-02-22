import { DEFAULT_LANG, DefaultLang, Languages } from "./languages"

type SectionKeys<S extends string, K extends string> =
  K extends `${S}${infer Rest}` ? K : never

type Dictionary<K extends string> = {
  [Lang in DefaultLang]: {
    [Key in K]?: string
  }
}

/**
  * With this hook we configure the dictionary and the lang only once and the following times we will call t('key') already configured.
*/
export function useTranslations<K extends string, S extends string>(
  dictionary: Dictionary<K>,
  lang: Languages,
  section?: S // <- only to infer the codes of the section
): (key: SectionKeys<S, K>) => string | undefined {

  return (key: SectionKeys<S, K>) =>  {
    if(!(key in dictionary[DEFAULT_LANG]))
      throw new Error(`Key: "${key}" not exist in default lang`)

    if(
      !dictionary[lang as DefaultLang] ||
      !(key in dictionary[lang as DefaultLang])
    ) lang = DEFAULT_LANG

    return dictionary[lang as DefaultLang][key]
  }
}

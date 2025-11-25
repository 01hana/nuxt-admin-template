export function usePageI18n() {
  const route = useRoute();

  const { t, setLocaleMessage, locale } = useI18n({ useScope: 'local' });

  const rawName = route.name?.toString() ?? '';

  // 移除 ___zh-TW / ___en
  const baseName = rawName.replace(/___[\w-]+$/, '');

  onMounted(async () => {
    try {
      const messages = await import(
        `../../i18n/locales/${locale.value}/pages/${baseName}.json`
      ).then(m => m.default);

      setLocaleMessage(locale.value, messages);
    } catch (e) {
      console.warn(`No page locale for: ${locale}/pages/${baseName}.json`);
    }
  });

  return { t };
}

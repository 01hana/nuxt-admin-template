import type { VxeGlobalI18nLocale } from 'vxe-table';

import VxeTable from 'vxe-table';
import VxeUI from 'vxe-pc-ui';

// import ExcelJS from 'exceljs';
// import VXETablePluginExportXLSX from 'vxe-table-plugin-export-xlsx';

import 'vxe-table/lib/style.css';
import 'vxe-pc-ui/lib/style.css';

import { tableConfig, iconConfig } from './config';

export default defineNuxtPlugin(async ({ vueApp }) => {
  vueApp.use(VxeTable);
  vueApp.use(VxeUI);

  VxeTable.formats.add('formatDate', ({ cellValue }) => {
    if (!cellValue) return '';

    const { formatDate } = useFormat();

    return formatDate(cellValue);
  });

  const nuxtApp = useNuxtApp();
  const locale = nuxtApp.$i18n.locale.value;

  const { default: message } = await getLocalePackage(locale);

  const localeMap: { [key: string]: VxeGlobalI18nLocale } = {
    en: 'en-US',
    zh_tw: 'zh-TW',
  };

  const lang = localeMap[locale as 'en' | 'zh_tw'] as VxeGlobalI18nLocale;

  VxeUI.setI18n(lang, message);
  VxeUI.setLanguage(lang);
  VxeUI.setConfig(tableConfig);
  VxeUI.setIcon(iconConfig);
  //   VxeUI.use(VXETablePluginExportXLSX, {
  //     ExcelJS,
  //   });
});

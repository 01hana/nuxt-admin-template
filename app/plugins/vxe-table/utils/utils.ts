export const getLocalePackage = (value?: string): Promise<any> => {
  const locale: string = value ?? 'zh_tw';

  const packageConfigurations: { [key: string]: () => Promise<any> } = {
    en: () => import('vxe-pc-ui/lib/language/en-US'),
    zh_tw: () => import('vxe-pc-ui/lib/language/zh-TW'),
  };

  const isPackageExist: boolean = Object.prototype.hasOwnProperty.call(
    packageConfigurations,
    locale,
  );

  if (isPackageExist) return packageConfigurations[locale]!();

  return packageConfigurations['zh_tw']!();
};

import { Settings as ProSettings } from '@ant-design/pro-layout';

type DefaultSettings = Partial<ProSettings> & {
    pwa?: boolean;
    logo?: string;
};

const proSettings: DefaultSettings = {
    navTheme: 'dark',
    layout: 'side',
    contentWidth: 'Fluid',
    headerHeight: 48,
    primaryColor: '#181818',
    fixedHeader: true,
    fixSiderbar: true,
    splitMenus: false,
};

export type { DefaultSettings };

export default proSettings;

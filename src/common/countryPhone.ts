export type ICountry = {
    short: string;
    name: string;
    en: string;
    tel: string;
    pinyin: string;
    hk: string;
    letter?: boolean;
};

export const letters: string[] = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
];

const data: ICountry[] = [
    {
        short: 'AD',
        name: '安道尔共和国',
        en: 'Andorra',
        tel: '376',
        pinyin: 'adeghg',
        hk: '安道爾共和國',
    },
    {
        short: 'AE',
        name: '阿拉伯联合酋长国',
        en: 'UnitedArabEmirates',
        tel: '971',
        pinyin: 'alblhqzg',
        hk: '阿拉伯聯合酋長國',
    },
    {
        short: 'AF',
        name: '阿富汗',
        en: 'Afghanistan',
        tel: '93',
        pinyin: 'afh',
        hk: '阿富汗',
    },
    {
        short: 'AG',
        name: '安提瓜和巴布达',
        en: 'AntiguaandBarbuda',
        tel: '1268',
        pinyin: 'atghbbd',
        hk: '安提瓜和巴布達',
    },
    {
        short: 'AI',
        name: '安圭拉岛',
        en: 'Anguilla',
        tel: '1264',
        pinyin: 'agld',
        hk: '安圭拉島',
    },
    {
        short: 'AL',
        name: '阿尔巴尼亚',
        en: 'Albania',
        tel: '355',
        pinyin: 'aebny',
        hk: '阿爾巴尼亞',
    },
    {
        short: 'AM',
        name: '阿美尼亚',
        en: 'Armenia',
        tel: '374',
        pinyin: 'amny',
        hk: '阿美尼亞',
    },
    {
        short: '',
        name: '阿森松',
        en: 'Ascension',
        tel: '247',
        pinyin: 'als',
        hk: '阿森松',
    },
    {
        short: 'AO',
        name: '安哥拉',
        en: 'Angola',
        tel: '244',
        pinyin: 'agl',
        hk: '安哥拉',
    },
    {
        short: 'AR',
        name: '阿根廷',
        en: 'Argentina',
        tel: '54',
        pinyin: 'agt',
        hk: '阿根廷',
    },
    {
        short: 'AT',
        name: '奥地利',
        en: 'Austria',
        tel: '43',
        pinyin: 'adl',
        hk: '奧地利',
    },
    {
        short: 'AU',
        name: '澳大利亚',
        en: 'Australia',
        tel: '61',
        pinyin: 'adly',
        hk: '澳大利亞',
    },
    {
        short: 'AZ',
        name: '阿塞拜疆',
        en: 'Azerbaijan',
        tel: '994',
        pinyin: 'asbj',
        hk: '阿塞拜疆',
    },
    {
        short: 'BB',
        name: '巴巴多斯',
        en: 'Barbados',
        tel: '1246',
        pinyin: 'bbds',
        hk: '巴巴多斯',
    },
    {
        short: 'BD',
        name: '孟加拉国',
        en: 'Bangladesh',
        tel: '880',
        pinyin: 'mjlg',
        hk: '孟加拉國',
    },
    {
        short: 'BE',
        name: '比利时',
        en: 'Belgium',
        tel: '32',
        pinyin: 'bls',
        hk: '比利時',
    },
    {
        short: 'BF',
        name: '布基纳法索',
        en: 'Burkina-faso',
        tel: '226',
        pinyin: 'bjnfs',
        hk: '布基納法索',
    },
    {
        short: 'BG',
        name: '保加利亚',
        en: 'Bulgaria',
        tel: '359',
        pinyin: 'bjly',
        hk: '保加利亞',
    },
    {
        short: 'BH',
        name: '巴林',
        en: 'Bahrain',
        tel: '973',
        pinyin: 'bl',
        hk: '巴林',
    },
    {
        short: 'BI',
        name: '布隆迪',
        en: 'Burundi',
        tel: '257',
        pinyin: 'bld',
        hk: '布隆迪',
    },
    {
        short: 'BJ',
        name: '贝宁',
        en: 'Benin',
        tel: '229',
        pinyin: 'bl',
        hk: '貝寧',
    },
    {
        short: 'BL',
        name: '巴勒斯坦',
        en: 'Palestine',
        tel: '970',
        pinyin: 'blst',
        hk: '巴勒斯坦',
    },
    {
        short: 'BM',
        name: '百慕大群岛',
        en: 'BermudaIs.',
        tel: '1441',
        pinyin: 'bmdqd',
        hk: '百慕大群島',
    },
    {
        short: 'BN',
        name: '文莱',
        en: 'Brunei',
        tel: '673',
        pinyin: 'wl',
        hk: '文萊',
    },
    {
        short: 'BO',
        name: '玻利维亚',
        en: 'Bolivia',
        tel: '591',
        pinyin: 'blwy',
        hk: '玻利維亞',
    },
    {
        short: 'BR',
        name: '巴西',
        en: 'Brazil',
        tel: '55',
        pinyin: 'bx',
        hk: '巴西',
    },
    {
        short: 'BS',
        name: '巴哈马',
        en: 'Bahamas',
        tel: '1242',
        pinyin: 'bhm',
        hk: '巴哈馬',
    },
    {
        short: 'BW',
        name: '博茨瓦纳',
        en: 'Botswana',
        tel: '267',
        pinyin: 'bcwn',
        hk: '博茨瓦納',
    },
    {
        short: 'BY',
        name: '白俄罗斯',
        en: 'Belarus',
        tel: '375',
        pinyin: 'bels',
        hk: '白俄羅斯',
    },
    {
        short: 'BZ',
        name: '伯利兹',
        en: 'Belize',
        tel: '501',
        pinyin: 'blz',
        hk: '伯利茲',
    },
    {
        short: 'CA',
        name: '加拿大',
        en: 'Canada',
        tel: '1',
        pinyin: 'jnd',
        hk: '加拿大',
    },
    {
        short: '',
        name: '开曼群岛',
        en: 'CaymanIs.',
        tel: '1345',
        pinyin: 'kmqd',
        hk: '開曼群島',
    },
    {
        short: 'CF',
        name: '中非共和国',
        en: 'CentralAfricanRepublic',
        tel: '236',
        pinyin: 'zfghg',
        hk: '中非共和國',
    },
    {
        short: 'CG',
        name: '刚果',
        en: 'Congo',
        tel: '242',
        pinyin: 'gg',
        hk: '剛果',
    },
    {
        short: 'CH',
        name: '瑞士',
        en: 'Switzerland',
        tel: '41',
        pinyin: 'rs',
        hk: '瑞士',
    },
    {
        short: 'CK',
        name: '库克群岛',
        en: 'CookIs.',
        tel: '682',
        pinyin: 'kkqd',
        hk: '庫克群島',
    },
    {
        short: 'CL',
        name: '智利',
        en: 'Chile',
        tel: '56',
        pinyin: 'zl',
        hk: '智利',
    },
    {
        short: 'CM',
        name: '喀麦隆',
        en: 'Cameroon',
        tel: '237',
        pinyin: 'kml',
        hk: '喀麥隆',
    },
    {
        short: 'CN',
        name: '中国',
        en: 'China',
        tel: '86',
        pinyin: 'zg',
        hk: '中國',
    },
    {
        short: 'CO',
        name: '哥伦比亚',
        en: 'Colombia',
        tel: '57',
        pinyin: 'glby',
        hk: '哥倫比亞',
    },
    {
        short: 'CR',
        name: '哥斯达黎加',
        en: 'CostaRica',
        tel: '506',
        pinyin: 'gsdlj',
        hk: '哥斯達黎加',
    },
    {
        short: 'CS',
        name: '捷克',
        en: 'Czech',
        tel: '420',
        pinyin: 'jk',
        hk: '捷克',
    },
    {
        short: 'CU',
        name: '古巴',
        en: 'Cuba',
        tel: '53',
        pinyin: 'gb',
        hk: '古巴',
    },
    {
        short: 'CY',
        name: '塞浦路斯',
        en: 'Cyprus',
        tel: '357',
        pinyin: 'spls',
        hk: '塞浦路斯',
    },
    {
        short: 'DE',
        name: '德国',
        en: 'Germany',
        tel: '49',
        pinyin: 'dg',
        hk: '德國',
    },
    {
        short: 'DJ',
        name: '吉布提',
        en: 'Djibouti',
        tel: '253',
        pinyin: 'jbt',
        hk: '吉布提',
    },
    {
        short: 'DK',
        name: '丹麦',
        en: 'Denmark',
        tel: '45',
        pinyin: 'dm',
        hk: '丹麥',
    },
    {
        short: 'DO',
        name: '多米尼加共和国',
        en: 'DominicaRep.',
        tel: '1890',
        pinyin: 'dmnjghg',
        hk: '多米尼加共和國',
    },
    {
        short: 'DZ',
        name: '阿尔及利亚',
        en: 'Algeria',
        tel: '213',
        pinyin: 'aejly',
        hk: '阿爾及利亞',
    },
    {
        short: 'EC',
        name: '厄瓜多尔',
        en: 'Ecuador',
        tel: '593',
        pinyin: 'egde',
        hk: '厄瓜多爾',
    },
    {
        short: 'EE',
        name: '爱沙尼亚',
        en: 'Estonia',
        tel: '372',
        pinyin: 'asny',
        hk: '愛沙尼亞',
    },
    {
        short: 'EG',
        name: '埃及',
        en: 'Egypt',
        tel: '20',
        pinyin: 'ej',
        hk: '埃及',
    },
    {
        short: 'ES',
        name: '西班牙',
        en: 'Spain',
        tel: '34',
        pinyin: 'xby',
        hk: '西班牙',
    },
    {
        short: 'ET',
        name: '埃塞俄比亚',
        en: 'Ethiopia',
        tel: '251',
        pinyin: 'aseby',
        hk: '埃塞俄比亞',
    },
    {
        short: 'FI',
        name: '芬兰',
        en: 'Finland',
        tel: '358',
        pinyin: 'fl',
        hk: '芬蘭',
    },
    {
        short: 'FJ',
        name: '斐济',
        en: 'Fiji',
        tel: '679',
        pinyin: 'fj',
        hk: '斐濟',
    },
    {
        short: 'FR',
        name: '法国',
        en: 'France',
        tel: '33',
        pinyin: 'fg',
        hk: '法國',
    },
    {
        short: 'GA',
        name: '加蓬',
        en: 'Gabon',
        tel: '241',
        pinyin: 'jp',
        hk: '加蓬',
    },
    {
        short: 'GB',
        name: '英国',
        en: 'UnitedKiongdom',
        tel: '44',
        pinyin: 'yg',
        hk: '英國',
    },
    {
        short: 'GD',
        name: '格林纳达',
        en: 'Grenada',
        tel: '1809',
        pinyin: 'glnd',
        hk: '格林納達',
    },
    {
        short: 'GE',
        name: '格鲁吉亚',
        en: 'Georgia',
        tel: '995',
        pinyin: 'gljy',
        hk: '格魯吉亞',
    },
    {
        short: 'GF',
        name: '法属圭亚那',
        en: 'FrenchGuiana',
        tel: '594',
        pinyin: 'fsgyn',
        hk: '法屬圭亞那',
    },
    {
        short: 'GH',
        name: '加纳',
        en: 'Ghana',
        tel: '233',
        pinyin: 'jn',
        hk: '加納',
    },
    {
        short: 'GI',
        name: '直布罗陀',
        en: 'Gibraltar',
        tel: '350',
        pinyin: 'zblt',
        hk: '直布羅陀',
    },
    {
        short: 'GM',
        name: '冈比亚',
        en: 'Gambia',
        tel: '220',
        pinyin: 'gby',
        hk: '岡比亞',
    },
    {
        short: 'GN',
        name: '几内亚',
        en: 'Guinea',
        tel: '224',
        pinyin: 'jny',
        hk: '幾內亞',
    },
    {
        short: 'GR',
        name: '希腊',
        en: 'Greece',
        tel: '30',
        pinyin: 'xl',
        hk: '希臘',
    },
    {
        short: 'GT',
        name: '危地马拉',
        en: 'Guatemala',
        tel: '502',
        pinyin: 'wdml',
        hk: '危地馬拉',
    },
    {
        short: 'GU',
        name: '关岛',
        en: 'Guam',
        tel: '1671',
        pinyin: 'gd',
        hk: '關島',
    },
    {
        short: 'GY',
        name: '圭亚那',
        en: 'Guyana',
        tel: '592',
        pinyin: 'gyn',
        hk: '圭亞那',
    },
    {
        short: 'HK',
        name: '香港(中国)',
        en: 'Hongkong',
        tel: '852',
        pinyin: 'xgzg',
        hk: '香港(中國)',
    },
    {
        short: 'HN',
        name: '洪都拉斯',
        en: 'Honduras',
        tel: '504',
        pinyin: 'hdls',
        hk: '洪都拉斯',
    },
    {
        short: 'HT',
        name: '海地',
        en: 'Haiti',
        tel: '509',
        pinyin: 'hd',
        hk: '海地',
    },
    {
        short: 'HU',
        name: '匈牙利',
        en: 'Hungary',
        tel: '36',
        pinyin: 'xyl',
        hk: '匈牙利',
    },
    {
        short: 'ID',
        name: '印度尼西亚',
        en: 'Indonesia',
        tel: '62',
        pinyin: 'ydnxy',
        hk: '印度尼西亞',
    },
    {
        short: 'IE',
        name: '爱尔兰',
        en: 'Ireland',
        tel: '353',
        pinyin: 'ael',
        hk: '愛爾蘭',
    },
    {
        short: 'IL',
        name: '以色列',
        en: 'Israel',
        tel: '972',
        pinyin: 'ysl',
        hk: '以色列',
    },
    {
        short: 'IN',
        name: '印度',
        en: 'India',
        tel: '91',
        pinyin: 'yd',
        hk: '印度',
    },
    {
        short: 'IQ',
        name: '伊拉克',
        en: 'Iraq',
        tel: '964',
        pinyin: 'ylk',
        hk: '伊拉克',
    },
    {
        short: 'IR',
        name: '伊朗',
        en: 'Iran',
        tel: '98',
        pinyin: 'yl',
        hk: '伊朗',
    },
    {
        short: 'IS',
        name: '冰岛',
        en: 'Iceland',
        tel: '354',
        pinyin: 'bd',
        hk: '冰島',
    },
    {
        short: 'IT',
        name: '意大利',
        en: 'Italy',
        tel: '39',
        pinyin: 'ydl',
        hk: '意大利',
    },
    {
        short: '',
        name: '科特迪瓦',
        en: 'IvoryCoast',
        tel: '225',
        pinyin: 'ktdw',
        hk: '科特迪瓦',
    },
    {
        short: 'JM',
        name: '牙买加',
        en: 'Jamaica',
        tel: '1876',
        pinyin: 'ymj',
        hk: '牙買加',
    },
    {
        short: 'JO',
        name: '约旦',
        en: 'Jordan',
        tel: '962',
        pinyin: 'yd',
        hk: '約旦',
    },
    {
        short: 'JP',
        name: '日本',
        en: 'Japan',
        tel: '81',
        pinyin: 'rb',
        hk: '日本',
    },
    {
        short: 'KE',
        name: '肯尼亚',
        en: 'Kenya',
        tel: '254',
        pinyin: 'kny',
        hk: '肯尼亞',
    },
    {
        short: 'KG',
        name: '吉尔吉斯坦',
        en: 'Kyrgyzstan',
        tel: '331',
        pinyin: 'jejst',
        hk: '吉爾吉斯坦',
    },
    {
        short: 'KH',
        name: '柬埔寨',
        en: 'Kampuchea(Cambodia)',
        tel: '855',
        pinyin: 'jpz',
        hk: '柬埔寨',
    },
    {
        short: 'KP',
        name: '朝鲜',
        en: 'NorthKorea',
        tel: '850',
        pinyin: 'cx',
        hk: '朝鮮',
    },
    {
        short: 'KR',
        name: '韩国',
        en: 'Korea',
        tel: '82',
        pinyin: 'hg',
        hk: '韓國',
    },
    {
        short: 'KW',
        name: '科威特',
        en: 'Kuwait',
        tel: '965',
        pinyin: 'kwt',
        hk: '科威特',
    },
    {
        short: 'KZ',
        name: '哈萨克斯坦',
        en: 'Kazakstan',
        tel: '327',
        pinyin: 'hskst',
        hk: '哈薩克斯坦',
    },
    {
        short: 'LA',
        name: '老挝',
        en: 'Laos',
        tel: '856',
        pinyin: 'lw',
        hk: '老撾',
    },
    {
        short: 'LB',
        name: '黎巴嫩',
        en: 'Lebanon',
        tel: '961',
        pinyin: 'lbn',
        hk: '黎巴嫩',
    },
    {
        short: 'LC',
        name: '圣卢西亚',
        en: 'St.Lucia',
        tel: '1758',
        pinyin: 'slxy',
        hk: '聖盧西亞',
    },
    {
        short: 'LI',
        name: '列支敦士登',
        en: 'Liechtenstein',
        tel: '423',
        pinyin: 'lzdsd',
        hk: '列支敦士登',
    },
    {
        short: 'LK',
        name: '斯里兰卡',
        en: 'SriLanka',
        tel: '94',
        pinyin: 'sllk',
        hk: '斯裏蘭卡',
    },
    {
        short: 'LR',
        name: '利比里亚',
        en: 'Liberia',
        tel: '231',
        pinyin: 'lbly',
        hk: '利比裏亞',
    },
    {
        short: 'LS',
        name: '莱索托',
        en: 'Lesotho',
        tel: '266',
        pinyin: 'lst',
        hk: '萊索托',
    },
    {
        short: 'LT',
        name: '立陶宛',
        en: 'Lithuania',
        tel: '370',
        pinyin: 'ltw',
        hk: '立陶宛',
    },
    {
        short: 'LU',
        name: '卢森堡',
        en: 'Luxembourg',
        tel: '352',
        pinyin: 'lsb',
        hk: '盧森堡',
    },
    {
        short: 'LV',
        name: '拉脱维亚',
        en: 'Latvia',
        tel: '371',
        pinyin: 'ltwy',
        hk: '拉脫維亞',
    },
    {
        short: 'LY',
        name: '利比亚',
        en: 'Libya',
        tel: '218',
        pinyin: 'lby',
        hk: '利比亞',
    },
    {
        short: 'MA',
        name: '摩洛哥',
        en: 'Morocco',
        tel: '212',
        pinyin: 'mlg',
        hk: '摩洛哥',
    },
    {
        short: 'MC',
        name: '摩纳哥',
        en: 'Monaco',
        tel: '377',
        pinyin: 'mng',
        hk: '摩納哥',
    },
    {
        short: 'MD',
        name: '摩尔多瓦',
        en: 'Moldova,Republicof',
        tel: '373',
        pinyin: 'medw',
        hk: '摩爾多瓦',
    },
    {
        short: 'MG',
        name: '马达加斯加',
        en: 'Madagascar',
        tel: '261',
        pinyin: 'mdjsj',
        hk: '馬達加斯加',
    },
    {
        short: 'ML',
        name: '马里',
        en: 'Mali',
        tel: '223',
        pinyin: 'ml',
        hk: '馬裏',
    },
    {
        short: 'MM',
        name: '缅甸',
        en: 'Burma',
        tel: '95',
        pinyin: 'md',
        hk: '緬甸',
    },
    {
        short: 'MN',
        name: '蒙古',
        en: 'Mongolia',
        tel: '976',
        pinyin: 'mg',
        hk: '蒙古',
    },
    {
        short: 'MO',
        name: '澳门（中国）',
        en: 'Macao',
        tel: '853',
        pinyin: 'am zg',
        hk: '澳門（中國）',
    },
    {
        short: 'MS',
        name: '蒙特塞拉特岛',
        en: 'MontserratIs',
        tel: '1664',
        pinyin: 'mtsstd',
        hk: '蒙特塞拉特島',
    },
    {
        short: 'MT',
        name: '马耳他',
        en: 'Malta',
        tel: '356',
        pinyin: 'met',
        hk: '馬耳他',
    },
    {
        short: '',
        name: '马里亚那群岛',
        en: 'MarianaIs',
        tel: '1670',
        pinyin: 'mlynqd',
        hk: '馬裏亞那群島',
    },
    {
        short: '',
        name: '马提尼克',
        en: 'Martinique',
        tel: '596',
        pinyin: 'mtnk',
        hk: '馬提尼克',
    },
    {
        short: 'MU',
        name: '毛里求斯',
        en: 'Mauritius',
        tel: '230',
        pinyin: 'mlqs',
        hk: '毛裏求斯',
    },
    {
        short: 'MV',
        name: '马尔代夫',
        en: 'Maldives',
        tel: '960',
        pinyin: 'medf',
        hk: '馬爾代夫',
    },
    {
        short: 'MW',
        name: '马拉维',
        en: 'Malawi',
        tel: '265',
        pinyin: 'mlw',
        hk: '馬拉維',
    },
    {
        short: 'MX',
        name: '墨西哥',
        en: 'Mexico',
        tel: '52',
        pinyin: 'mxg',
        hk: '墨西哥',
    },
    {
        short: 'MY',
        name: '马来西亚',
        en: 'Malaysia',
        tel: '60',
        pinyin: 'mlxy',
        hk: '馬來西亞',
    },
    {
        short: 'MZ',
        name: '莫桑比克',
        en: 'Mozambique',
        tel: '258',
        pinyin: 'msbk',
        hk: '莫桑比克',
    },
    {
        short: 'NA',
        name: '纳米比亚',
        en: 'Namibia',
        tel: '264',
        pinyin: 'nmby',
        hk: '納米比亞',
    },
    {
        short: 'NG',
        name: '尼日利亚',
        en: 'Nigeria',
        tel: '234',
        pinyin: 'nrly',
        hk: '尼日利亞',
    },
    {
        short: 'NI',
        name: '尼加拉瓜',
        en: 'Nicaragua',
        tel: '505',
        pinyin: 'njlg',
        hk: '尼加拉瓜',
    },
    {
        short: 'NL',
        name: '荷兰',
        en: 'Netherlands',
        tel: '31',
        pinyin: 'hl',
        hk: '荷蘭',
    },
    {
        short: 'NO',
        name: '挪威',
        en: 'Norway',
        tel: '47',
        pinyin: 'nw',
        hk: '挪威',
    },
    {
        short: 'NP',
        name: '尼泊尔',
        en: 'Nepal',
        tel: '977',
        pinyin: 'nbe',
        hk: '尼日爾',
    },
    {
        short: '',
        name: '荷属安的列斯',
        en: 'NetheriandsAntilles',
        tel: '599',
        pinyin: 'hsadls',
        hk: '荷屬安的列斯',
    },
    {
        short: 'NR',
        name: '瑙鲁',
        en: 'Nauru',
        tel: '674',
        pinyin: 'nl',
        hk: '瑙魯',
    },
    {
        short: 'NZ',
        name: '新西兰',
        en: 'NewZealand',
        tel: '64',
        pinyin: 'xxl',
        hk: '新西蘭',
    },
    {
        short: 'OM',
        name: '阿曼',
        en: 'Oman',
        tel: '968',
        pinyin: 'am',
        hk: '阿曼',
    },
    {
        short: 'PA',
        name: '巴拿马',
        en: 'Panama',
        tel: '507',
        pinyin: 'bnm',
        hk: '巴拿馬',
    },
    {
        short: 'PE',
        name: '秘鲁',
        en: 'Peru',
        tel: '51',
        pinyin: 'bl',
        hk: '秘魯',
    },
    {
        short: 'PF',
        name: '法属玻利尼西亚',
        en: 'FrenchPolynesia',
        tel: '689',
        pinyin: 'fsblnxy',
        hk: '法屬玻利尼西亞',
    },
    {
        short: 'PG',
        name: '巴布亚新几内亚',
        en: 'PapuaNewCuinea',
        tel: '675',
        pinyin: 'bbyxjny',
        hk: '巴布亞新幾內亞',
    },
    {
        short: 'PH',
        name: '菲律宾',
        en: 'Philippines',
        tel: '63',
        pinyin: 'flb',
        hk: '菲律賓',
    },
    {
        short: 'PK',
        name: '巴基斯坦',
        en: 'Pakistan',
        tel: '92',
        pinyin: 'bjst',
        hk: '巴基斯坦',
    },
    {
        short: 'PL',
        name: '波兰',
        en: 'Poland',
        tel: '48',
        pinyin: 'bl',
        hk: '波蘭',
    },
    {
        short: 'PR',
        name: '波多黎各',
        en: 'PuertoRico',
        tel: '1787',
        pinyin: 'bdlg',
        hk: '波多黎各',
    },
    {
        short: 'PT',
        name: '葡萄牙',
        en: 'Portugal',
        tel: '351',
        pinyin: 'pty',
        hk: '葡萄牙',
    },
    {
        short: 'PY',
        name: '巴拉圭',
        en: 'Paraguay',
        tel: '595',
        pinyin: 'blg',
        hk: '巴拉圭',
    },
    {
        short: 'QA',
        name: '卡塔尔',
        en: 'Qatar',
        tel: '974',
        pinyin: 'kte',
        hk: '卡塔爾',
    },
    {
        short: '',
        name: '留尼旺',
        en: 'Reunion',
        tel: '262',
        pinyin: 'lnw',
        hk: '留尼旺',
    },
    {
        short: 'RO',
        name: '罗马尼亚',
        en: 'Romania',
        tel: '40',
        pinyin: 'lmny',
        hk: '羅馬尼亞',
    },
    {
        short: 'RU',
        name: '俄罗斯',
        en: 'Russia',
        tel: '7',
        pinyin: 'els',
        hk: '俄羅斯',
    },
    {
        short: 'SA',
        name: '沙特阿拉伯',
        en: 'SaudiArabia',
        tel: '966',
        pinyin: 'stalb',
        hk: '沙特阿拉伯',
    },
    {
        short: 'SB',
        name: '所罗门群岛',
        en: 'SolomonIs',
        tel: '677',
        pinyin: 'slmqd',
        hk: '所羅門群島',
    },
    {
        short: 'SC',
        name: '塞舌尔',
        en: 'Seychelles',
        tel: '248',
        pinyin: 'sse',
        hk: '塞舌爾',
    },
    {
        short: 'SD',
        name: '苏丹',
        en: 'Sudan',
        tel: '249',
        pinyin: 'sd',
        hk: '蘇丹',
    },
    {
        short: 'SE',
        name: '瑞典',
        en: 'Sweden',
        tel: '46',
        pinyin: 'rd',
        hk: '瑞典',
    },
    {
        short: 'SG',
        name: '新加坡',
        en: 'Singapore',
        tel: '65',
        pinyin: 'xjp',
        hk: '新加坡',
    },
    {
        short: 'SI',
        name: '斯洛文尼亚',
        en: 'Slovenia',
        tel: '386',
        pinyin: 'slwny',
        hk: '斯洛文尼亞',
    },
    {
        short: 'SK',
        name: '斯洛伐克',
        en: 'Slovakia',
        tel: '421',
        pinyin: 'slfk',
        hk: '斯洛伐克',
    },
    {
        short: 'SL',
        name: '塞拉利昂',
        en: 'SierraLeone',
        tel: '232',
        pinyin: 'slla',
        hk: '塞拉利昂',
    },
    {
        short: 'SM',
        name: '圣马力诺',
        en: 'SanMarino',
        tel: '378',
        pinyin: 'smln',
        hk: '聖馬力諾',
    },
    {
        short: '',
        name: '东萨摩亚(美)',
        en: 'SamoaEastern',
        tel: '684',
        pinyin: 'dsmym',
        hk: '東薩摩亞(美)',
    },
    {
        short: '',
        name: '西萨摩亚',
        en: 'SamoaWest',
        tel: '685',
        pinyin: 'xsmy',
        hk: '西薩摩亞',
    },
    {
        short: 'SN',
        name: '塞内加尔',
        en: 'Senegal',
        tel: '221',
        pinyin: 'snje',
        hk: '塞內加爾',
    },
    {
        short: 'SO',
        name: '索马里',
        en: 'Somali',
        tel: '252',
        pinyin: 'sml',
        hk: '索馬裏',
    },
    {
        short: 'SR',
        name: '苏里南',
        en: 'Suriname',
        tel: '597',
        pinyin: 'sln',
        hk: '蘇裏南',
    },
    {
        short: 'ST',
        name: '圣多美和普林西比',
        en: 'SaoTomeandPrincipe',
        tel: '239',
        pinyin: 'sdmhplxb',
        hk: '聖多美和普林西比',
    },
    {
        short: 'SV',
        name: '萨尔瓦多',
        en: 'EISalvador',
        tel: '503',
        pinyin: 'sewd',
        hk: '薩爾瓦多',
    },
    {
        short: 'SY',
        name: '叙利亚',
        en: 'Syria',
        tel: '963',
        pinyin: 'xly',
        hk: '敘利亞',
    },
    {
        short: 'SZ',
        name: '斯威士兰',
        en: 'Swaziland',
        tel: '268',
        pinyin: 'swsl',
        hk: '斯威士蘭',
    },
    {
        short: 'TD',
        name: '乍得',
        en: 'Chad',
        tel: '235',
        pinyin: 'zd',
        hk: '乍得',
    },
    {
        short: 'TG',
        name: '多哥',
        en: 'Togo',
        tel: '228',
        pinyin: 'dg',
        hk: '多哥',
    },
    {
        short: 'TH',
        name: '泰国',
        en: 'Thailand',
        tel: '66',
        pinyin: 'tg',
        hk: '泰國',
    },
    {
        short: 'TJ',
        name: '塔吉克斯坦',
        en: 'Tajikstan',
        tel: '992',
        pinyin: 'tjkst',
        hk: '塔吉克斯坦',
    },
    {
        short: 'TM',
        name: '土库曼斯坦',
        en: 'Turkmenistan',
        tel: '993',
        pinyin: 'tkmst',
        hk: '土庫曼斯坦',
    },
    {
        short: 'TN',
        name: '突尼斯',
        en: 'Tunisia',
        tel: '216',
        pinyin: 'tns',
        hk: '突尼斯',
    },
    {
        short: 'TO',
        name: '汤加',
        en: 'Tonga',
        tel: '676',
        pinyin: 'tj',
        hk: '湯加',
    },
    {
        short: 'TR',
        name: '土耳其',
        en: 'Turkey',
        tel: '90',
        pinyin: 'teq',
        hk: '土耳其',
    },
    {
        short: 'TT',
        name: '特立尼达和多巴哥',
        en: 'TrinidadandTobago',
        tel: '1809',
        pinyin: 'tlndhdbg',
        hk: '格林納達',
    },
    {
        short: 'TW',
        name: '台湾（中国）',
        en: 'Taiwan',
        tel: '886',
        pinyin: 'twzg',
        hk: '臺灣（中國）',
    },
    {
        short: 'TZ',
        name: '坦桑尼亚',
        en: 'Tanzania',
        tel: '255',
        pinyin: 'tsny',
        hk: '坦桑尼亞',
    },
    {
        short: 'UA',
        name: '乌克兰',
        en: 'Ukraine',
        tel: '380',
        pinyin: 'wkl',
        hk: '烏克蘭',
    },
    {
        short: 'UG',
        name: '乌干达',
        en: 'Uganda',
        tel: '256',
        pinyin: 'wgd',
        hk: '烏幹達',
    },
    {
        short: 'US',
        name: '美国',
        en: 'UnitedStatesofAmerica',
        tel: '1',
        pinyin: 'mg',
        hk: '加拿大',
    },
    {
        short: 'UY',
        name: '乌拉圭',
        en: 'Uruguay',
        tel: '598',
        pinyin: 'wlg',
        hk: '烏拉圭',
    },
    {
        short: 'UZ',
        name: '乌兹别克斯坦',
        en: 'Uzbekistan',
        tel: '233',
        pinyin: 'wzbkst',
        hk: '加納',
    },
    {
        short: 'VC',
        name: '圣文森特岛',
        en: 'SaintVincent',
        tel: '1784',
        pinyin: 'swstd',
        hk: '聖文森特島',
    },
    {
        short: 'VE',
        name: '委内瑞拉',
        en: 'Venezuela',
        tel: '58',
        pinyin: 'wnrl',
        hk: '委內瑞拉',
    },
    {
        short: 'VN',
        name: '越南',
        en: 'Vietnam',
        tel: '84',
        pinyin: 'yn',
        hk: '越南',
    },
    {
        short: 'YE',
        name: '也门',
        en: 'Yemen',
        tel: '967',
        pinyin: 'ym',
        hk: '也門',
    },
    {
        short: 'YU',
        name: '南斯拉夫',
        en: 'Yugoslavia',
        tel: '381',
        pinyin: 'nslf',
        hk: '南斯拉夫',
    },
    {
        short: 'ZA',
        name: '南非',
        en: 'SouthAfrica',
        tel: '27',
        pinyin: 'nf',
        hk: '南非',
    },
    {
        short: 'ZM',
        name: '赞比亚',
        en: 'Zambia',
        tel: '260',
        pinyin: 'zby',
        hk: '贊比亞',
    },
    {
        short: 'ZR',
        name: '扎伊尔',
        en: 'Zaire',
        tel: '243',
        pinyin: 'zye',
        hk: '紮伊爾',
    },
    {
        short: 'ZW',
        name: '津巴布韦',
        en: 'Zimbabwe',
        tel: '263',
        pinyin: 'jbbw',
        hk: '津巴布韋',
    },
];

function preProcessingData() {
    // 按拼音排序
    const countries = data.sort((a, b) => (a.pinyin > b.pinyin ? 1 : -1));
    // 插入字母
    // for (let i = 0; i < letters.length; i++) {
    //     const insertIndex = countries.findIndex(
    //         (item) => item.pinyin.slice(0, 1) === letters[i].toLowerCase(),
    //     );
    //     if (insertIndex > -1) {
    //         countries.splice(insertIndex, 0, {
    //             name: letters[i],
    //             en: letters[i],
    //             tel: letters[i],
    //             pinyin: letters[i],
    //             short: letters[i],
    //             hk: letters[i],
    //             letter: true,
    //         });
    //     }
    // }
    return countries;
}

export const countries = preProcessingData();

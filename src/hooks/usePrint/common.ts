export const dealBigMoney = (n: string) => {
    if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) return '数据非法';
    let unit = '亿千百拾万千百拾亿千百拾万千百拾元',
        str = '';
    const p = n.indexOf('.');
    // 带小数(两位小数)
    if (p >= 0) {
        n = n.substring(0, p) + (n + '00').substring(p + 1, p + 3);
        unit += '角分';
    }
    unit = unit.substring(unit.length - n.length);

    for (let i = 0; i < n.length; i++)
        str +=
            '零壹贰叁肆伍陆柒捌玖'.charAt(Number(n.charAt(i))) + unit.charAt(i);
    return (
        str
            .replace(/零(千|百|拾|角)/g, '零')
            .replace(/(零)+/g, '零')
            .replace(/零(万|亿|元)/g, '$1')
            .replace(/(亿)万|壹(拾)/g, '$1$2')
            .replace(/^元零?|零分/g, '')
            .replace(/元$/g, '元整') || '零元'
    );
};

export const currencyMap: { [propName: string]: string } = {
    PHP: '₱',
    HKD: 'HK$',
    USDT: '₮',
    RMB: '¥',
    USD: '$',
    KRW: '₩',
};

import fx from 'money';

export class CurrencyUtils {

  static flagInitialized = false;

  static initialize() {
    if (!CurrencyUtils.flagInitialized) {
      fetch('https://openexchangerates.org/api/latest.json?app_id=f7b71ca45910443da521e299c2f08433', {
        method: 'get'
      })
        .then((response) => response.json())
        .then(result => {
          console.info('rate', result);
          fx.rates = result.rates;
          CurrencyUtils.flagInitialized = true;
        })
        .catch(e => console.info('error rate', e));
    }
  }
  static getCurrencyName(type) {
    if (type === 'USD' || type === '$') {
      return 'USD';
    } else if (type === 'EURO' || type === '€') {
      return 'EUR';
    } else if (type === 'POUND' || type === '£' || type === '₤') {
      return 'GBP';
    } else if (type === 'BITCOIN') {
      return 'BTC';
    } else if (type === 'RUB') {
      return 'RUB';
    } else if (type === 'YEN' || type === '¥') {
      return 'JPY';
    } else if (type === 'KRW') {
      return 'KRW';
    }
    return '';
  }
  static getCurrencyType(name) {
    switch (name) {
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      case 'GBP':
        return '₤';
      case 'BTC':
        return '฿';
      case 'RUB':
        return '₽';
      case 'JPY':
        return '¥';
      case 'KRW':
        return '₩';
      default:
        return '$';
    }
  }
  static convertCurrency(value, fromType, toType) {
    if (CurrencyUtils.flagInitialized) {
      const from = this.getCurrencyName(fromType);
      const to = this.getCurrencyName(toType);
      if (from !== '' && to !== '') {
        const convertParam = { from, to };
        return fx.convert(value, convertParam);
      }
      return 0;
    }
    return CurrencyUtils.initialize();
  }
}

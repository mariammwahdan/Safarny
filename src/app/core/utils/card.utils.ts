export type CardType = 'Visa' | 'MasterCard' | 'Meeza' | 'Unknown';

export function getCardType(cardNumber: string): CardType {
  const sanitized = cardNumber.replace(/\s|-/g, '');

  if (sanitized.startsWith('4')) {
    return 'Visa';
  }

  if (sanitized.startsWith('5')) {
    return 'MasterCard';
  }

  if (sanitized.startsWith('6')) {
    return 'Meeza';
  }

  return 'Unknown';
}

export function formatCardNumber(cardNumber: string): string {
  const sanitized = cardNumber.replace(/\s|-/g, '');
  const groups = sanitized.match(/.{1,4}/g) || [];
  return groups.join(' ');
}

export function formatExpiryDate(expiryDate: string): string {
  const sanitized = expiryDate.replace(/\D/g, '');
  if (sanitized.length >= 2) {
    return `${sanitized.slice(0, 2)}/${sanitized.slice(2, 4)}`;
  }
  return sanitized;
}

export function getCardImage(cardType: CardType): string {
  switch (cardType) {
    case 'Visa':
      return '/assets/visa.png';
    case 'MasterCard':
      return '/assets/mastercard.png';
    case 'Meeza':
      return '/assets/meeza.png';
    default:
      return '/assets/unknown-card.png';
  }
}

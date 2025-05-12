export type CardType = 'Visa' | 'MasterCard' | 'Meeza' | 'Unknown';

export function getCardType(cardNumber: string): CardType {
  const sanitized = cardNumber.replace(/\s|-/g, '');

  if (/^4\d{12}(\d{3})?$/.test(sanitized)) {
    return 'Visa';
  }

  if (
    /^(5[1-5]\d{14}|2(2[2-9]\d{12}|[3-6]\d{13}|7([01]\d{12}|20\d{12})))$/.test(
      sanitized
    )
  ) {
    return 'MasterCard';
  }

  if (/^(5078|5079|5080|588845)\d{10}$/.test(sanitized)) {
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

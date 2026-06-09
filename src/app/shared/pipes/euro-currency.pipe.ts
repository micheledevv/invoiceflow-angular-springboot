import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'euroCurrency',
  standalone: true
})
export class EuroCurrencyPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    const amount = Number(value ?? 0);

    const formattedAmount = new Intl.NumberFormat('it-IT', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);

    return `€ ${formattedAmount}`;
  }
}
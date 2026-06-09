import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'italianDate',
  standalone: true
})
export class ItalianDatePipe implements PipeTransform {
  private readonly months = [
    'Gen',
    'Feb',
    'Mar',
    'Apr',
    'Mag',
    'Giu',
    'Lug',
    'Ago',
    'Set',
    'Ott',
    'Nov',
    'Dic'
  ];

  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    const [year, month, day] = value.split('-').map(Number);

    if (!year || !month || !day) {
      return value;
    }

    return `${day} ${this.months[month - 1]} ${year}`;
  }
}
import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[SoloFecha]'
})
export class FechaDirective {

  constructor(public elemento: ElementRef) { }

  @HostListener('input', ['$event']) onKeyDown(_event) {
    const initalValue: string = this.elemento.nativeElement.value;
    this.elemento.nativeElement.value = initalValue.replace(/[^0-9\/]*/gi, '');

    if (initalValue !== this.elemento.nativeElement.value)
      _event.stopPropagation();

  }

}
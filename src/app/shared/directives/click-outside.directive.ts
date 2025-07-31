import { Directive, ElementRef, HostListener, inject, output } from "@angular/core";

@Directive({
  selector: '[clickOutside]',
  standalone: true
})
export class ClickOutsideDirective {

  private readonly _elementRef: ElementRef = inject(ElementRef);
  public clickOutside = output<void>();

  /**
   * Host listener for click events on the document.
   * If the click is outside the element, it emits the clickOutside event.
   * @param target - The target of the click event.
   * @return {void}
   */
  @HostListener('document:click', ['$event.target'])
  public onClick(target: any): void {
    if (!this._elementRef.nativeElement.contains(target)) {
      this.clickOutside.emit();
    }
  }

}
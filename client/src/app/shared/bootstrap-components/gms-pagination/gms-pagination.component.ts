import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Component for generating a pagination element.
 */
@Component({
  selector: 'gms-pagination',
  templateUrl: './gms-pagination.component.html',
  styleUrls: ['./gms-pagination.component.scss']
})
export class GmsPaginationComponent {

  /**
   * If true, the "First" and "Last" page links are shown.
   */
  @Input() boundaryLinks: boolean = false;

  /**
   * The number of items in your paginated collection.
   * Note, that this is not the number of pages. Page numbers are calculated
   * dynamically based on <pre>collectionSize</pre> and <pre>pageSize</pre>. i.e.: if you have 100 items
   * in your collection and displaying 20 items per page, you'll end up with 5 pages.
   */
  @Input() collectionSize: number = 0;

  /**
   * If true, the "Next" and "Previous" page links are shown.
   */
  @Input() directionLinks: boolean = true;

  /**
   * If true, pagination links will be disabled.
   */
  @Input() disabled: boolean = false;

  /**
   * If true, the ellipsis symbols and first/last page numbers will be shown when maxSize > number of pages.
   */
  @Input() ellipses: boolean = true;

  /**
   * The maximum number of pages to display per page.
   */
  @Input() maxSize: number = 10;

  /**
   * The current page. Page numbers start with 1.
   */
  @Input() page: number = 1;

  /**
   * The number of items per page.
   */
  @Input() pageSize: number = 10;

  /**
   * Whether to rotate pages when maxSize > number of pages.
   * The current page always stays in the middle if true.
   */
  @Input() rotate: boolean = false;

  /**
   * The pagination display size.
   */
  @Input() size: string = '-';

  @Output() onPageChangeAction: EventEmitter<number> = new EventEmitter<number>();

  /**
   * Holds the previous emitted value.
   * If the new value to be emitted is the same as the previous one, it is no emitted at all.
   */
  private previous: number = 0;

  /**
   * Component constructor
   */
  constructor() { }

  /**
   * Emits a notification with the new page number once the page has changed.
   *
   * @param newPageNumber New page number. Page numbers start in 1.
   */
  onPageChange(newPageNumber: number): void {
    if (this.previous != newPageNumber) {
      this.previous = newPageNumber;
      this.onPageChangeAction.emit(newPageNumber);
    }
  }

}
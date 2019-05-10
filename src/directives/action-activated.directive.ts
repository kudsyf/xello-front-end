import { ActionsService } from './../services/actions.service';
import { Directive, Input, ElementRef, Renderer2, HostListener, OnInit, OnDestroy } from '@angular/core';
import { filter } from 'rxjs/operators';
@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[actionActivated]'
})
export class ActionActivatedDirective implements OnInit, OnDestroy {

  @Input() btnId;
  @Input() tooltipTitle;
  delay = 2000;
  tooltipElement: HTMLElement;
  tooltip_width = 0;
  tooltip_height = 0;
  _subscription: any;
  parent = this.renderer.parentNode(this.el.nativeElement);
  el_pos;
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private actions_services: ActionsService
  ) {

  }
  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  create(btn: any, title: string) {
    this.tooltipElement = this.renderer.createElement('span');
    this.renderer.appendChild(
      this.tooltipElement,
      this.renderer.createText(title)
    );
    const position = this.calculate_position(btn);
    this.renderer.addClass(this.tooltipElement, 'xello-tooltip');
    this.renderer.addClass(this.tooltipElement, `tooltip-${position.btn}`);
    this.tooltip_height = this.tooltipElement.getBoundingClientRect().height;
    this.tooltip_width = this.tooltipElement.getBoundingClientRect().width;
    this.renderer.setStyle(this.tooltipElement, 'left', position.left);
    this.renderer.setStyle(this.tooltipElement, 'top', position.top);
    this.renderer.parentNode(this.el.nativeElement).append(this.tooltipElement);

  }
  ngOnInit(): void {
    this._subscription = this.actions_services._actions.pipe(filter(pos => pos.btn === this.btnId))
      .subscribe(position => {
        const xellonodes = this.parent.querySelectorAll('.xello-tooltip');
        const xelloArray = Array.from(xellonodes);
        xelloArray.map((node: any) => {
          this.renderer.setStyle(node, 'left', position.left);
          this.renderer.setStyle(node, 'top', position.top);
        });
      });
  }
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.dispose_all();
  }


  @HostListener('window:scroll', ['$event'])
  onWindowScroll($event) {

    Array.from(this.parent.querySelectorAll('.xello-tooltip'))
      .map((node: any) => {
        const scrolled_btn = Array.from(node.classList)
          .find((c: string) => c.startsWith('tooltip-')).toString();
        const btn = scrolled_btn.substr(scrolled_btn.length - 1, 1);
        const pos = this.calculate_position(btn);
        this.actions_services._actions.next(pos);
      });


  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    const btn = event.target.getAttribute('btnId');
    const title = event.target.getAttribute('tooltipTitle');

    if (btn) {
      this.create(btn, title);
      this.dispose(btn);

    } else {

      this.dispose_all();
    }

  }

  dispose(btn) {
    Array.from(this.parent.querySelectorAll('.xello-tooltip'))
      .filter((node: any) => !node.classList.contains(`tooltip-${btn}`))
      .map((node: any) => this.renderer.removeChild(this.parent, node));
  }

  dispose_all() {
    const node = this.parent.querySelectorAll('.xello-tooltip');
    if (node.length > 0) {
      this.renderer.removeChild(this.parent, node[0]);
    }
  }

  calculate_position(btn: string): any {


    const btn_elm = this.parent.querySelector(`*[btnId='${btn}']`);
    const top_space = btn_elm.getBoundingClientRect().top - this.tooltip_height - 10;

    const pos = { btn: btn, left: '', top: '' };
    if (top_space > 0) {
      pos.left = `${btn_elm.offsetLeft}px`;
      pos.top = '-50px';
    } else {
      pos.left = `${btn_elm.offsetLeft}px`;
      pos.top = '50px';
    }
    return pos;

  }
}

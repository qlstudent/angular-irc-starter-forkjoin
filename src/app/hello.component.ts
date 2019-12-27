import { Component, Input } from '@angular/core';

@Component({
  selector: 'sb-hello',
  template: `
  <h1>
    Hello, 
    <span class="name">{{ name }}</span>!
  </h1>
  `,
  styles: [`
    .name { font-style: oblique; }
  `],
})
export class HelloComponent  {
  @Input() name: string;
}

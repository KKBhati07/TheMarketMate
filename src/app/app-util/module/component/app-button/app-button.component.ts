import {ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation} from "@angular/core";

@Component({
  selector: "mm-button",
  templateUrl: "./app-button.component.html",
  styleUrls: ["./app-button.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None

})
export class AppButtonComponent implements OnInit {
  @Input() type = ''
  @Input() disabled:boolean = false
  @Input() text = ''
  @Input() icon = ''
  @Input() position = ''
  @Input() background = ''
  @Input() class = ''
  @Input() style = {}
  @Input() iconClass = ''

  ngOnInit() {}
}

import {Component, inject} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {ButtonPrimaryComponent} from "../../buttons/button-primary/button-primary.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-email-confirmation-popup',
  standalone: true,
  imports: [
    ButtonPrimaryComponent,
    FormsModule,
    NgOptimizedImage,
    ReactiveFormsModule
  ],
  templateUrl: './help-email-confirmation-popup.component.html',
  styleUrl: './help-email-confirmation-popup.component.scss'
})
export class HelpEmailConfirmationPopupComponent {
  private dialogRef = inject(MatDialogRef<HelpEmailConfirmationPopupComponent>);

  closeDialog(): void {
    this.dialogRef.close();
  }
}

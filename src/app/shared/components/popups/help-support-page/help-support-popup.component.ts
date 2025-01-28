import {Component, inject, OnInit} from '@angular/core';
import {ReactiveFormsModule, FormsModule, NgForm} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {InputComponent} from "../../input/input.component";
import {ButtonPrimaryComponent} from "../../buttons/button-primary/button-primary.component";
import {NgOptimizedImage} from "@angular/common";
import emailJS from '@emailjs/browser';
import {HelpEmailConfirmationPopupComponent} from "../email-confirmation-popup/help-email-confirmation-popup.component";
import {environment} from "../../../../app.environment";

@Component({
  selector: 'app-help-support-popup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputComponent,
    ButtonPrimaryComponent,
    NgOptimizedImage,
    FormsModule,
  ],
  templateUrl: './help-support-popup.component.html',
  styleUrls: ['./help-support-popup.component.scss'],
})
export class HelpSupportPopupComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<HelpSupportPopupComponent>);
  private dialog = inject(MatDialog);
  email: string = '';
  message: string = '';

  ngOnInit() {
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  openConfirmationDialog(): void {
    this.dialog.open(HelpEmailConfirmationPopupComponent, {
      width: '450px',
    });
  }

  onSubmitForm(form: NgForm) {
    if (form.valid) {
      emailJS.send(environment.emailJSServiceID, environment.emailJSTemplateID, form.value, {
        publicKey: environment.emailJSPublicKey,
      }).then(() => {
        this.closeDialog();
        this.openConfirmationDialog();
      });
    }
  }
}

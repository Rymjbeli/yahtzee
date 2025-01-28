import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, NgForm} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { InputComponent} from "../../input/input.component";
import {ButtonPrimaryComponent} from "../../buttons/button-primary/button-primary.component";
import {NgOptimizedImage} from "@angular/common";
import emailjs from '@emailjs/browser';
import {HelpEmailConfirmationPopupComponent} from "../email-confirmation-popup/help-email-confirmation-popup.component";
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
  email : string = '';
  message : string = '';

  ngOnInit() {}

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
      emailjs.send('service_z76dp8h', 'template_49g4qgb', form.value, {
        publicKey: '30P-uslbHKzqBG7JN'
      }).then(() => {
        this.closeDialog();
        this.openConfirmationDialog();
      });
      console.log(form.value);
    }
  }
}

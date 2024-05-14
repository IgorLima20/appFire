import { Component, OnInit, ViewChild } from '@angular/core';
import { Product } from '../interfaces/Product';
import { ProductService } from '../services/product.service';
import { AlertController, IonModal } from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  products: Product[] = [];

  @ViewChild(IonModal) modal!: IonModal;

  isModalOpen = false;

  productForm!: FormGroup;

  constructor(private productService: ProductService, private alertController: AlertController) {}

  ngOnInit(): void {
    this.listar();
  }

  listar() {
    this.productService.getAll().subscribe((product) => {
      this.products = product;
    });
  }

  createForm(isOpen: boolean, product?: Product) {
    this.isModalOpen = isOpen;
    this.productForm = new FormGroup({
      id: new FormControl(product?.id ? product?.id: ''),
      nome: new FormControl(product?.nome ? product?.nome: '', [Validators.required]),
      descricao: new FormControl(product?.descricao ? product?.descricao : '', [Validators.required]),
      preco: new FormControl(product?.preco ? product?.preco : '', [Validators.required])
    });
  }

  async confirmRemove(id: string) {
    const alert = await this.alertController.create({
      header: 'Confirmação!!',
      subHeader: 'Deseja Realmente excluir esse registro?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Excluir!',
          role: 'confirm',
          handler: () => {
            this.remove(id);
          },
        },
      ],
    });
    await alert.present();
  }
  
  close() {
    this.isModalOpen = false;
  }

  cancel() {
    this.modal?.dismiss(null, 'cancel');
  }

  submit() {
    if (this.productForm.valid) {
      this.productService.save(this.productForm.value)
      .then(() => {
        this.modal?.dismiss(null, 'confirm');
      }).catch((e) => {
        console.log(e);
      });
    }
  }

  remove(id: string) {
    if (id) {
      this.productService.delete(id)
        .then()
        .catch((e) => {
          console.log(e);
        });
    }
  }

}

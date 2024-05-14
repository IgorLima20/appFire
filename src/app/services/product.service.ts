import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable, map } from 'rxjs';
import { Product } from '../interfaces/Product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private PATH = 'products/';

  constructor(private db: AngularFireDatabase) { }
  
  //Lista produtos
  getAll(): Observable<Product[]> {
    return this.db.list(this.PATH, ref => ref.orderByChild('name'))
      .snapshotChanges()
      .pipe(
        map((changes: any) => {
          console.log(changes); 
          return changes.map((c: any) => ({ id: c.payload.key, ...c.payload.val() }));
        })
      )
  }

  //Cria um novo produto ou altera um produto existente caso o mesmo possua um id
  save(product: Product) {
    return new Promise((resolve, reject) => {
      if (product.id) {
        this.db.list(this.PATH)
          .update(product.id, { 
             nome: product.nome,
             descricao: product.descricao,
             preco: product.preco })
          .then((resp) => resolve(resp))
          .catch((e) => reject(e));
      } else {
        this.db.list(this.PATH)
          .push({ 
            nome: product.nome,
            descricao: product.descricao,
            preco: product.preco })
          .then((resp) => resolve(resp))
          .catch((e) => reject(e));
      }
    })
  }

  //Apaga um produto da base atráves do seu
  delete(id: string) {
    return this.db.list(this.PATH).remove(id);
  }

}

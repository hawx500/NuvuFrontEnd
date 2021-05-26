import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomMaterialsModule } from './custom-materials.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatSortModule } from '@angular/material';
import { MensajeComponent } from './componentes/mensaje/mensaje.component';
import { CargandoComponent } from './componentes/cargando/cargando.component';
import { SoloNumerosDirective } from './directive/solo-numeros.directive';
import { FechaDirective } from './directive/solo-fecha.directive';
import { UsuarioComponent } from './componentes/usuario/usuario.component';
import { UsuarioTarjetaComponent } from './componentes/usuario/usuario-tarjeta/usuario-tarjeta.component';

@NgModule({
  declarations: [    
    AppComponent, MensajeComponent, CargandoComponent, SoloNumerosDirective, FechaDirective, UsuarioComponent, UsuarioTarjetaComponent,    
  ],
  imports: [
    BrowserModule,    
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    CustomMaterialsModule,
    HttpClientModule,
    MatSortModule    
  ],
  entryComponents: [   
    MensajeComponent,
    CargandoComponent,
    UsuarioTarjetaComponent
  ],
  providers: [
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

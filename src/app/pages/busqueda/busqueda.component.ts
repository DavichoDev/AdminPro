import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from '../../services/busquedas.service';
import { Medico } from '../../models/medico.model';
import { Hospital } from '../../models/hospital.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css'],
})
export class BusquedaComponent implements OnInit {
  public usuarios: Usuario[] = [];
  public medicos: Medico[] = [];
  public hospitales: Hospital[] = [];


  constructor(
    private activatedRoute: ActivatedRoute,
    private busquedasService: BusquedasService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) =>
      this.busquedaGlobal( params.termino )
    );
  }

  busquedaGlobal( termino: string ) {
    this.busquedasService.busquedaGlobal( termino )
    .subscribe( (busqueda: any) => {
      this.usuarios = busqueda.usuarios;
      this.medicos = busqueda.medicos;
      this.hospitales = busqueda.hospitales;
    });
  }

}

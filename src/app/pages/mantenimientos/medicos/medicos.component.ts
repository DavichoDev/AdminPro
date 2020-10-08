import { Component, OnInit, OnDestroy } from '@angular/core';
import { MedicoService } from '../../../services/medico.service';
import { Medico } from '../../../models/medico.model';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { BusquedasService } from '../../../services/busquedas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [],
})
export class MedicosComponent implements OnInit, OnDestroy {
  public medicos: Medico[];
  public medicosTemp: Medico[];
  public cargando: boolean = true;
  public imgSubs: Subscription;

  constructor(
    private medicoService: MedicoService,
    private modalImagenService: ModalImagenService,
    private busquedasService: BusquedasService
  ) {}

  ngOnInit(): void {
    this.cargarMedicos();
    // Se subscribe al observable pendiente de cambios en bd.
    this.refreshMedicos();
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  cargarMedicos() {
    this.cargando = true;
    this.medicoService.getMedicos().subscribe((medicos) => {
      console.log(medicos);
      this.cargando = false;
      this.medicosTemp = medicos;
      this.medicos = medicos;
    });
  }

  eliminarMedico(medico: Medico) {
    Swal.fire({
      title: `¿Estas seguro?`,
      text: `Seguro que deseas borrar el medico ${medico.nombre}`,
      icon: 'warning',
      confirmButtonText: 'Borrar',
      confirmButtonColor: '#3085d6',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicoService.eliminarMedico(medico._id).subscribe(
          (response) => {
            this.cargarMedicos();
            Swal.fire(
              'Eliminación exitosa',
              `¡El medico ${medico.nombre} fue eliminado existosammente!`,
              'success'
            );
          },
          (err) => {
            Swal.fire('Error al eliminar', err.error.msg, 'error');
          }
        );
      }
    });
  }

  abrirModal(medico: Medico) {
    this.modalImagenService.abrirModal('medicos', medico._id, medico.img);
  }

  refreshMedicos() {
    // Se recargan usuarios cuando ocurre un cambio en el modal.
    this.imgSubs = this.modalImagenService.cambioEnImagen
      .pipe(delay(500))
      .subscribe(() => this.cargarMedicos());
  }

  buscar(termino: string) {
    if (!termino || termino === '') {
      /* Alternative: this.cargarUsuarios */
      this.medicos = this.medicosTemp;
      return;
    }

    this.busquedasService.buscar('medicos', termino).subscribe((resultados) => {
      this.medicos = resultados;
    });
  }
}

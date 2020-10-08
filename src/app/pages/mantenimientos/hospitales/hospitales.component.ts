import { Component, OnInit, OnDestroy } from '@angular/core';
import { HospitalService } from '../../../services/hospital.service';
import { Hospital } from '../../../models/hospital.model';
import Swal from 'sweetalert2';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { BusquedasService } from '../../../services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [],
})
export class HospitalesComponent implements OnInit, OnDestroy {
  public hospitales: Hospital[] = [];
  public hospitalesTemp: Hospital[] = [];
  public cargando: boolean = true;
  public imgSubs: Subscription;

  constructor(
    private hospitalService: HospitalService,
    private modalImagenService: ModalImagenService,
    private busquedasService: BusquedasService
  ) {}

  ngOnInit(): void {
    this.cargarHospitales();
    // Refresca los ususarios modificados
    this.refreshHospitales();
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  crearHospital(nombre: string) {
    this.hospitalService.crearHospital(nombre).subscribe(
      (response: any) => {
        this.hospitales.push(response.hospital);
      },
      (err) => Swal.fire('Error', err.error.msg, 'error')
    );
  }

  guardarCambios(hospital: Hospital) {
    this.hospitalService
      .actualizarHospital(hospital._id, hospital.nombre)
      .subscribe(
        (response) => {
          Swal.fire(
            'Actualización exitosa',
            '¡El hospital fue actualizado existosammente!',
            'success'
          );
        },
        (err) => {
          Swal.fire('Error al Actualizar', err.error.msg, 'error');
        }
      );
  }

  eliminarHospital(hospital: Hospital) {
    Swal.fire({
      title: `¿Estas seguro?`,
      text: `Seguro que deseas borrar el hospital ${hospital.nombre}`,
      icon: 'warning',
      confirmButtonText: 'Borrar',
      confirmButtonColor: '#3085d6',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.hospitalService.eliminarHospital(hospital._id).subscribe(
          (response) => {
            this.cargarHospitales();
            Swal.fire(
              'Eliminación exitosa',
              `¡El hospital ${hospital.nombre} fue eliminado existosammente!`,
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

  cargarHospitales() {
    this.cargando = true;
    this.hospitalService.getHospitales().subscribe((hospitales) => {
      this.cargando = false;
      this.hospitalesTemp = hospitales;
      this.hospitales = hospitales;
    });
  }

  buscar(termino: string) {
    if (!termino || termino === '') {
      /* Alternative: this.cargarUsuarios */
      this.hospitales = this.hospitalesTemp;
      return;
    }

    this.busquedasService
      .buscar('hospitales', termino)
      .subscribe((resultados) => {
        this.hospitales = resultados;
      });
  }

  cambiarImagen(hospital: Hospital) {
    this.modalImagenService.abrirModal(
      'hospitales',
      hospital._id,
      hospital.img
    );
  }

  refreshHospitales() {
    // Se recargan usuarios cuando ocurre un cambio en el modal.
    this.imgSubs = this.modalImagenService.cambioEnImagen
      .pipe(delay(500))
      .subscribe(() => this.cargarHospitales());
  }

  async abrirSweetAlert() {
    const { value } = await Swal.fire<string>({
      title: 'Crear hospital',
      text: 'Ingrese el nombre del nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
    });
    // Valdación dissmiss
    if (!value) {
      return;
    }
    /*strin.trim() elimina los espacios, tabs,etc a los lados del string.*/
    if (value.trim().length > 0) {
      this.crearHospital(value);
    }
  }
}

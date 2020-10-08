import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Hospital } from '../../../models/hospital.model';
import { HospitalService } from '../../../services/hospital.service';
import { Medico } from '../../../models/medico.model';
import { MedicoService } from '../../../services/medico.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { pipe } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [],
})
export class MedicoComponent implements OnInit {
  // Variables de carga de vista.
  public medicoForm: FormGroup;
  public hospitales: Hospital[] = [];
  public hospitalSeleccionado: Hospital;
  public medicoSeleccionado: Medico;
  // Variables de controld de vista.
  public cargando: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private hospitalService: HospitalService,
    private medicoService: MedicoService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Obtener id por URL
    this.activatedRoute.params.subscribe((params) => {
      this.cargarMedico(params.id);
    });
    this.InitMedicoComponent();
  }

  // Inicializa funciones del Componente.
  InitMedicoComponent() {
    this.inicializarMedicoForm();
    this.cargarHospitales();
    this.onChangeHospitales();
  }

  // (1) Inicializa el FormBuilder del Médico
  inicializarMedicoForm() {
    this.medicoForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required],
    });
  }

  // (2) Llena el select con los hospitales del la BD.
  cargarHospitales() {
    this.hospitalService.getHospitales().subscribe((hospitales: Hospital[]) => {
      this.hospitales = hospitales;
    });
  }

  // (3) Cambia foto del hopital según su ID.
  onChangeHospitales() {
    this.medicoForm.get('hospital').valueChanges.subscribe((hospitalId) => {
      this.hospitalSeleccionado = this.hospitales.find(
        (hospital) => hospital._id === hospitalId
      );
    });
  }

  guardarMedico() {
    const { nombre } = this.medicoForm.value;
    if (this.medicoSeleccionado) {
      const medico = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id,
      };
      this.medicoService.actualizarMedico(medico).subscribe((response: any) => {
        Swal.fire(
          '¡Actualización exitosa !',
          `El médico ${nombre} se ha actualizado correctamente`,
          'success'
        );
      });
    } else {
      this.medicoService
        .crearMedico(this.medicoForm.value)
        .subscribe((response: any) => {
          Swal.fire(
            '¡Registro exitoso!',
            `El médico ${nombre} se ha registrado correctamente`,
            'success'
          );
          // Navegación
          this.router.navigateByUrl(`/dashboard/medico/${response.medico._id}`);
        });
    }
  }

  cargarMedico(id: string) {
    this.cargando = true;
    if ( id === 'nuevo' ) {
      return;
    }

    this.medicoService.obtenerMedicoPorId(id)
    .pipe(
      delay(700)
    )
    .subscribe((medico) => {

      if (!medico) {
        return this.router.navigateByUrl('/dashboard/medicos');
      }

      const {
        nombre,
        hospital: { _id },
      } = medico;
      this.medicoSeleccionado = medico;
      this.medicoForm.setValue({ nombre, hospital: _id });
      this.cargando = false;
    });
  }


}

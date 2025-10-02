// import { Component } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';
// import { AuthService } from '../../services/auth.service';

// @Component({
//   selector: 'app-resgistro',
//   standalone: true,
//   templateUrl: './resgistro.component.html',
//   styleUrls: ['./resgistro.component.css'],
//   imports: [
//     FormsModule,
//     HttpClientModule,
//     CommonModule
//   ],
// })
// export class ResgistroComponent {
//   form = {
//     email: '',
//     password: ''
//   };

//   mensaje: string = '';
//   mostrarClave = false;

//   iconos: IconoAnimado[] = [];

//   constructor(
//     private http: HttpClient,
//     private router: Router,
//     private authService: AuthService
//   ) {}

//   ngOnInit(): void {
//     const clases = [
//       'fa-camera',
//       'fa-eye',
//       'fa-lock',
//       'fa-video',
//       'fa-key',
//       'fa-shield-alt'
//     ];
//     for (let i = 0; i < 40; i++) {
//       this.iconos.push({
//         class: clases[Math.floor(Math.random() * clases.length)],
//         left: Math.random() * 100,
//         duration: 6 + Math.random() * 6,
//         delay: Math.random() * 5,
//         size: 16 + Math.random() * 20
//       });
//     }
//   }

//   registrar() {
//     this.mensaje = '';

//     // Validación opcional
//     if (!this.form.email || !this.form.password) {
//       this.mensaje = 'Por favor completa todos los campos.';
//       return;
//     }

//     this.http.post<any>('http://localhost:3000/api/usuarios/registrar', this.form)
//       .subscribe({
//         next: res => {
//           this.authService.guardarToken(res.token);
//           this.mensaje = '✅ Registro exitoso. Sesión iniciada automáticamente.';
//           if (res.servicioActivo) {
//             this.router.navigate(['/panel-usuario']);
//           } else {
//             this.router.navigate(['/']);
//           }
//         },
//         error: err => {
//           this.mensaje = err.error?.message || '❌ Error al registrar.';
//         }
//       });
//   }

//   irAlInicio() {
//     this.router.navigate(['/']);
//   }
// }

// interface IconoAnimado {
//   class: string;
//   left: number;
//   duration: number;
//   delay: number;
//   size: number;
// }



import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-resgistro',
  standalone: true,
  templateUrl: './resgistro.component.html',
  styleUrls: ['./resgistro.component.css'],
  imports: [
    FormsModule,
    HttpClientModule,
    CommonModule
  ],
})
export class ResgistroComponent {
  form = {
    email: '',
    phone: '',
    password: ''
  };

  mensaje: string = '';
  mostrarClave = false;

  iconos: IconoAnimado[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const clases = [
      'fa-camera',
      'fa-eye',
      'fa-lock',
      'fa-video',
      'fa-key',
      'fa-shield-alt'
    ];
    for (let i = 0; i < 40; i++) {
      this.iconos.push({
        class: clases[Math.floor(Math.random() * clases.length)],
        left: Math.random() * 100,
        duration: 6 + Math.random() * 6,
        delay: Math.random() * 5,
        size: 16 + Math.random() * 20
      });
    }
  }

  registrar() {
    this.mensaje = '';

    // Validación opcional
    if (!this.form.email || !this.form.password || !this.form.phone) {
      this.mensaje = 'Por favor completa todos los campos.';
      return;
    }

    this.http.post<any>('http://localhost:3000/api/usuarios/registrar', this.form)
      .subscribe({
        next: res => {
          this.authService.guardarToken(res.token);
          this.mensaje = '✅ Registro exitoso. Sesión iniciada automáticamente.';
          if (res.servicioActivo) {
            this.router.navigate(['/panel-usuario']);
          } else {
            this.router.navigate(['/']);
          }
        },
        error: err => {
          this.mensaje = err.error?.message || '❌ Error al registrar.';
        }
      });
  }

  irAlInicio() {
    this.router.navigate(['/']);
  }
}

interface IconoAnimado {
  class: string;
  left: number;
  duration: number;
  delay: number;
  size: number;
}

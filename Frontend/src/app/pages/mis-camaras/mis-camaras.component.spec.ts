import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisCamarasComponent } from './mis-camaras.component';

describe('MisCamarasComponent', () => {
  let component: MisCamarasComponent;
  let fixture: ComponentFixture<MisCamarasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisCamarasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisCamarasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

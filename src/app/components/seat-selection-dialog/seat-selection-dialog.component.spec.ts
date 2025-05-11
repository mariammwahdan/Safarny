import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatSelectionDialogComponent } from './seat-selection-dialog.component';

describe('SeatSelectionDialogComponent', () => {
  let component: SeatSelectionDialogComponent;
  let fixture: ComponentFixture<SeatSelectionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeatSelectionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeatSelectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

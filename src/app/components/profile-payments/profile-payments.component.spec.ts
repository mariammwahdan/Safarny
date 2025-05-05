import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePaymentsComponent } from './profile-payments.component';

describe('ProfilePaymentsComponent', () => {
  let component: ProfilePaymentsComponent;
  let fixture: ComponentFixture<ProfilePaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilePaymentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilePaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

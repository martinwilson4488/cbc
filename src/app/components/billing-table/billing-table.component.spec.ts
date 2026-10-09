import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BillingTableComponent } from './billing-table.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('BillingTableComponent', () => {
  let component: BillingTableComponent;
  let fixture: ComponentFixture<BillingTableComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({ declarations: [BillingTableComponent], imports: [CommonModule, FormsModule] }).compileComponents();
    fixture = TestBed.createComponent(BillingTableComponent); component = fixture.componentInstance; fixture.detectChanges();
  });
  it('should create', () => expect(component).toBeTruthy());
});

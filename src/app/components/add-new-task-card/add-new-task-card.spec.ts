import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewTaskCard } from './add-new-task-card';

describe('AddNewTaskCard', () => {
  let component: AddNewTaskCard;
  let fixture: ComponentFixture<AddNewTaskCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewTaskCard],
    }).compileComponents();

    fixture = TestBed.createComponent(AddNewTaskCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

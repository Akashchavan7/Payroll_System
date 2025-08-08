import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentService } from '../Services/Department-serives/department.service';

@Component({
  selector: 'app-add-department',
  templateUrl: './add-department.component.html',
})
export class AddDepartmentComponent implements OnInit {
  departmentForm!: FormGroup;
  deptId?: number;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private deptService: DepartmentService,
    private router: Router
  ) {}

  ngOnInit() {
    this.departmentForm = this.fb.group({
      name: ['', Validators.required],
      status: ['active', Validators.required],
      description: [''],
    });

    this.deptId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = !!this.deptId;

    if (this.isEditMode) {
      this.loadDepartment();
    }
  }

  loadDepartment() {
    this.deptService.getDepartmentById(this.deptId!).subscribe(dept => {
      this.departmentForm.patchValue({
        name: dept.name,
        status: dept.status,
        description: dept.description,
      });
    });
  }

  onSubmit() {
    if (this.departmentForm.invalid) {
      return;
    }

    const formData = this.departmentForm.value;

    if (this.isEditMode) {
      this.deptService.updateDepartment(this.deptId!, formData).subscribe(() => {
        alert('Department updated successfully!');
        this.router.navigate(['/department'], { state: { message: 'updated' } });
      }, error => {
        alert('Error updating department.');
        console.error(error);
      });
    } else {
      this.deptService.addDepartments(formData).subscribe((res) => {
        console.log('Department added:', res); // ✅ Logging
        alert('Department added successfully!');
        this.router.navigate(['/department'], { state: { message: 'added' } });
      }, error => {
        alert('Error adding department.');
        console.error(error);
      });
    }
  }
}

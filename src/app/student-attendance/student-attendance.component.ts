import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentService } from '../student.service';

@Component({
  selector: 'app-student-attendance',
  templateUrl: './student-attendance.component.html',
  styleUrls: ['./student-attendance.component.css']
})
export class StudentAttendanceComponent implements OnInit {
  studentForm!: FormGroup;
  constructor(private studentService:StudentService,private router:Router) { 
    this.studentForm = new FormGroup({
      'id': new FormControl('', Validators.required),
      'attendanceDates': new FormControl('', Validators.required)
    })
  }

  ngOnInit(): void {
  }
  submitAttendance(){
    console.log("inside submitAttendance")
    Object.keys(this.studentForm.controls).forEach(field => {
      const control = this.studentForm.get(field);
      console.log(field)
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      }
    });

    if(this.studentForm.valid){
      this.studentService.getstudentByID(this.studentForm.value.id).subscribe((data) => {
        //DO STUFF HERE
        console.log(data)
        let arr=[]
        if(data.attendanceDates){
          arr=[...data.attendanceDates,this.studentForm.value.attendanceDates]
          // arr=data.attendanceDates
        }
        else
          arr.push(this.studentForm.value.attendanceDates)
        console.log(arr)
        this.studentForm.value.attendanceDates=arr
        console.log(this.studentForm.value);
        this.studentService.updatestudentById(this.studentForm.value.id,this.studentForm.value).subscribe(() => {
          this.router.navigate([`attendance-list/${this.studentForm.value.id}`])
        },() => {
          alert("Something Went Wrong")
        })
    },() => {
      alert("No such student, please try again!")
    });
      
      //this.studentForm.value.attendanceDates=prev.attendanceDates.push(this.studentForm.value.attendanceDates)
      
      
    }
  }

}

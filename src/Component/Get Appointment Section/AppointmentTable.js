import React, { useState } from 'react';
import { useContext } from 'react';
import { AllContext, CalenderContext } from '../../App';
import { useEffect } from 'react';
import data from '../../Data/appointment'
import AppointmentCart from './AppointmentCart';
import Modal from 'react-modal';
import { useForm } from 'react-hook-form';

Modal.setAppElement('#root')

const AppointmentTable = () => {

   // Get Calender Data from App.js
   const [date, setDate] = useContext(CalenderContext)

   // Get All Appointments Ticket Data For Booking
   const [allAppointments , setAllAppointments] = useState(data)

   // Selected Appointment Ticked
   const [selectedAppointment, setSelectedAppointment] = useState(null);

   // Popup Modal Form for Booking Appointment 
   const [modalIsOpen, setModalIsOpen] = useState(false);

   const modalController = (selectedAppointmentId) => {
      setModalIsOpen(true);
      const appointment = allAppointments.find(ap => ap.id === selectedAppointmentId);
      if(appointment){
         setSelectedAppointment(appointment)
      }
   }

   // Send Appointment Data in Database after fill-up modal form
   const [isBooked, setIsBooked] = useState(false);
   const bookingDate = `${date.getDate()}-${date.getMonth() +1}-${date.getFullYear()}`;
   const  makeBooking = (patientInfo) => {
      const appointment = {...selectedAppointment, category:'appointment',  bookingDate}
      const fullData = {...patientInfo, status:"Pending", appointment:appointment}
      console.log(fullData)
      fetch("http://localhost:3005/appointment",{
         method : "POST",
         headers : {
               "Content-type" : "application/json"
         },
         body: JSON.stringify(fullData)
      })
      .then(res =>res.json())
      .then(data => {
         console.log(data)
      })
      .catch(err => console.log(err))
   }

   // Form Submit Handler
   const { register, handleSubmit, errors } = useForm();
   const onSubmit = data => {
      setIsBooked(true);
      makeBooking(data)
   };

   return (
      <div className="appointments container py-5">
            <h3 className="text-primary text-center my-5">Available Appointments on {date.toLocaleString('default', { month: 'long' })} {date.getDate()}, {date.getFullYear()}</h3>

            <div className="row">
               {
                  allAppointments.map( singleData => <AppointmentCart 
                     appointment={singleData}
                     modalController={modalController}
                     ></AppointmentCart>)
               }               
            </div>

            {/* To Get Modal Box on Click Book Appointment Button */}
            <Modal  isOpen={modalIsOpen}
             onRequestClose={() => setModalIsOpen(false)} 
             style={{
                 overlay:{
                     backgroundColor:"rgba(130,125,125,0.75)"
                 },
                 content : {
                    top                   : '50%',
                    left                  : '50%',
                    right                 : 'auto',
                    bottom                : 'auto',
                    marginRight           : '-50%',
                    width                 :  '40%',
                    transform             : 'translate(-50%, -50%)'
                  }
             }}
            >
               {
                  isBooked ?
                  <div  className="text-center  py-5 my-5">
                     <a href="/appointment-section" className="delete" onClick={ () => setModalIsOpen(false)}><i className="fas fa-times-circle"></i></a>
                        <i className="fas fa-check-circle" style={{fontSize:"5em", color: 'green'}}></i>
                        <h4 className="mt-5 lead">Appointment Request Sent!</h4>
                  </div>
                  
                  :
                  selectedAppointment &&
                  <div className="px-4"> 
                     <h4 className="text-primary text-center">{selectedAppointment.subject}</h4>
                        <p className="text-center text-secondary  small mb-5">On {date.toLocaleString('default', { month: 'long' })} {date.getDate()}, {date.getFullYear()}</p>
                     <form onSubmit={handleSubmit(onSubmit)}>
                           <div className="form-group">
                              <input type="text" ref={register({ required: true })} name="name" placeholder="Your Name" className="form-control"/>
                              {errors.name && <span className="text-danger">This field is required</span>}

                           </div>
                           <div className="form-group">
                              <input type="text" ref={register({ required: true })} name="phone" placeholder="Phone Number" className="form-control"/>
                              {errors.phone && <span className="text-danger">This field is required</span>}
                           </div>
                           <div className="form-group">
                              <input type="text" ref={register({ required: true })} name="email" placeholder="Email" className="form-control"/>
                              {errors.email && <span className="text-danger">This field is required</span>}
                           </div>
                           <div className="form-group row">
                              <div className="col-4">
                                 
                                 <select className="form-control" name="gender" ref={register({ required: true })} >
                                       <option disabled={true} value="Selecte Gender">Select Gender</option>
                                       <option  value="Male">Male</option>
                                       <option  value="Female">Female</option>
                                       <option  value="Not set">Other</option>
                                 </select>
                                 {errors.gender && <span className="text-danger">This field is required</span>}

                              </div>
                              <div className="col-4">
                                 <input ref={register({ required: true })} className="form-control" name="age" placeholder="Your Age" type="number" />
                                 {errors.age && <span className="text-danger">This field is required</span>}
                              </div>
                              <div className="col-4">
                                 <input ref={register({ required: true })} className="form-control" name="weight" placeholder="Weight" type="number" />
                                 {errors.weight && <span className="text-danger">This field is required</span>}
                              </div>
                           </div>
                           
                           <div className="form-group text-center">
                              <button type="submit" className="btn btn-primary">Send</button>
                           </div>
                     </form>
                  </div>
               }
            </Modal>

        </div>
   );
};

export default AppointmentTable;
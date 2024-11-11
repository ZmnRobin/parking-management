import ParkingForm from '@/components/ParkingForm'
import React from 'react'

export default function EditParkingFormPage() {
  return (
    <div className='m-10 w-5/6 md:w-3/6 lg:w-3/6 mx-auto'>
        <ParkingForm editMode={true}/>
    </div>
  )
}

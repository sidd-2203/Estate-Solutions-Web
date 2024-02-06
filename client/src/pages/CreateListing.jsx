import React, { useState } from 'react'

import FormComponent from '../components/FormComponent.jsx';

export default function CreateListing() {
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 0,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false,
    })
    return (
        <FormComponent setFormData={setFormData} formData={formData} params={null}></FormComponent>
    )
}

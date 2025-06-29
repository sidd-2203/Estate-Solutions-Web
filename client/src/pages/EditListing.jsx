import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import FormComponent from '../components/FormComponent.jsx';

export default function EditListing() {
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


    const params = useParams();

    useEffect(() => {
        // the main callback of the useEffect cannot be an asyc function
        // so we create inside it
        const fetechListing = async () => {
            const res = await fetch(`/api/listing/get/${params.listingId}`);
            const data = await res.json();
            if (data.success=== false) {
                console.log(data.message);
                return;
            }
            setFormData(data);
        }
        fetechListing();
    }, []);

    return (
        <>
            <FormComponent formData={formData} setFormData={setFormData} params={params}></FormComponent>
        </>
    )
}

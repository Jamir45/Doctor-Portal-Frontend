import React from 'react';

const ServiceData = (props) => {
    console.log(props.data)
    const {name , img , description} = props.data;
    return (
        <div className="col-md-4 mb-5 text-center">
            <img src={img} alt="" height="70"/>
            <h4 className="my-4">{name}</h4>
            <p className="text-secondary">{description}</p>
        </div>
    );
};

export default ServiceData;
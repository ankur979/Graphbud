import React, { useEffect, useState } from 'react'
import "./home.css"
const baseUrl = process.env.REACT_APP_BASE_URL;
const Home = () => {
    const [companiesData, setCompaniesData] = useState([]);
    const [id, setId] = useState("")
    const [name, setName] = useState("")
    const [location, setLocation] = useState("")
    const [isOpen, setIsOpen] = useState(false);
    const [companyId, setCompanyId] = useState({});
    const [updateComapnyLocation, setUpdateComapnyLocation] = useState()
    const [updateComapnyName, setUpdateComapnyName] = useState()

    const fetchCompanyData = () => {
        fetch(`${baseUrl}/companies`)
            .then((response) => response.json())
            .then((data) => setCompaniesData(data))
            .catch((error) => console.error(error));
    }


    useEffect(() => {
        fetchCompanyData()
    }, []);
    const addComapnyHandler = (e) => {
        e.preventDefault()
        fetch(`${baseUrl}/company`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id,
                name,
                location
            }),
        })
            .then(response => response.json())
            .then(data => {
                fetchCompanyData()
                alert(data)
                setId("")
                setName("")
                setLocation("")
                // console.log( data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    const openModal = (company) => {
        setCompanyId(company.id)
        setUpdateComapnyName(company.name)
        setUpdateComapnyLocation(company.location)
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const updateCompanyHandler = (e) => {
        e.preventDefault()
        fetch(`${baseUrl}/company/${companyId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: updateComapnyName,
                location: updateComapnyLocation
            }),
        })
            .then(response => response.json())
            .then(data => {
                //  console.log('Success:', data);
                alert(data)
                fetchCompanyData()
                setIsOpen(false);
            })
            .catch(error => {
                console.error('Error:', error.json());
            });
    }

    const deleteCompanyHandler = (id) => {
        fetch(`${baseUrl}/company/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                //  console.log('Success:', data);
                alert(data)
                fetchCompanyData()
                setIsOpen(false);
            })
            .catch(error => {
                console.error('Error:', error.json());
            });
    }

    return (
        <>
            <div id='home'>
                <div className='create'>
                    <input type="text" placeholder='id' value={id} onChange={(e) => setId(e.target.value)} />
                    <input type="text" placeholder='name' value={name} onChange={(e) => setName(e.target.value)} />
                    <input type="text" placeholder='location' value={location} onChange={(e) => setLocation(e.target.value)} />
                    <button onClick={addComapnyHandler}>Add Company</button>
                </div>
                <div className="list">
                    {companiesData.map((company, index) => {
                        return (
                            <div className="listItem" key={index}>
                                <p>id : {company.id}</p>
                                <p>name : {company.name}</p>
                                <p>location : {company.location}</p>
                                <button className='update' onClick={() => openModal(company)}>Update</button>
                                <button className='delete' onClick={() => {
                                    const confirmed = window.confirm("Are you sure you want to remove this company")
                                    if (confirmed) {
                                        deleteCompanyHandler(company.id)
                                    }
                                }}>Delete</button>
                            </div>
                        )
                    })}
                </div>
            </div>
            {isOpen && (
                <div className="modal-box">
                    <div className="model-div">
                        <div className="modal-content">
                            <h2>Update Company</h2>
                            <input type="text" name="" id="" value={updateComapnyName} onChange={(e) => setUpdateComapnyName(e.target.value)} />
                            <input type="text" name="" id="" value={updateComapnyLocation} onChange={(e) => setUpdateComapnyLocation(e.target.value)} />
                            <div className='modal-button'>
                                <button type="button" onClick={closeModal} className="btn-warning">Close</button>
                                <button type="button" className="btn-success" onClick={updateCompanyHandler}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>)}
        </>

    )
}

export default Home
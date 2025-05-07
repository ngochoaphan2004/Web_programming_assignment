"use client"

import { useEffect, useState } from "react";
import UploadFileAvatar from "../../../../components/uploadAvatar/uploadAvatar";
import axiosConfig from "@/axiosConfig";
import { useAuth } from "@/app/contexts/auth";

export default function ProfilePage() {
    const { authen, loading, user, admin } = useAuth();

    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        dob: "",
        address: "",
        avatar: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData()
        Object.entries(formData).forEach((tit, val) => data.append(tit, val))
        if (file)
            data.append('avatar', file)

        await axiosConfig.post('user/profile',
            data,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            }
        ).catch((e) => {
            console.log(e);
        })
    };


    useEffect(() => {
        async function fetch() {
            const id = user.id
            await axiosConfig.get(`/users/${id}`).then((res) => {
                setFormData((prev) => ({
                    ...prev,
                    ...res.data.data
                }));
            })
        }
        fetch()
    }, [])


    return (
        <div className="page-heading px-4 py-8">
            <div className="page-title">
                <div className="row">
                    <div className="col-12 col-md-6 order-md-1 order-last">
                        <h3>Account Profile</h3>
                        <p className="text-subtitle text-muted">A page where users can change profile information</p>
                    </div>
                </div>
            </div>
            <section className="section">
                <div className="row">
                    <div className="col-12 col-lg-4">
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex justify-content-center align-items-center flex-column">
                                    <UploadFileAvatar avatar={formData.avatar} setFile={setFile} />

                                    <h3 className="mt-3">{formData.name}</h3>
                                    <p className="text-small">{formData.role == 1 ? "Người dùng" : "Người quản trị"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-8">
                        <div className="card">
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="name" className="form-label">Name</label>
                                        <input
                                            type="text"
                                            autoComplete="off"
                                            name="name"
                                            id="name"
                                            className="form-control"
                                            placeholder="Your Name"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input
                                            type="text"
                                            autoComplete="off"
                                            name="email"
                                            id="email"
                                            className="form-control"
                                            placeholder="Your Email"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="phone" className="form-label">Phone</label>
                                        <input
                                            type="number"
                                            autoComplete="off"
                                            name="phone"
                                            id="phone"
                                            className="form-control"
                                            placeholder="Your Phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="birthday" className="form-label">Birthday</label>
                                        <input
                                            type="date"
                                            autoComplete="off"
                                            name="dob"
                                            id="birthday"
                                            className="form-control"
                                            value={formData.dob}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="address" className="form-label">Address</label>
                                        <input
                                            type="text"
                                            autoComplete="off"
                                            name="address"
                                            id="address"
                                            className="form-control"
                                            placeholder="Your Address"
                                            value={formData.address}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-group justify-self-center">
                                        <button type="submit" className="btn btn-primary">
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
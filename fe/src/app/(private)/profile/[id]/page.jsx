"use client"

import { useParams } from "next/navigation";
export default function ProfilePage() {
    const params = useParams(); 
    const userID = params.id;

    return (
        <div className="page-heading">
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
                                    <div className="avatar avatar-2xl">
                                        <img src="/../../../../../avatar.png" alt="Avatar" className="w-[120px]! h-[120px]!"/>
                                    </div>
                                    <h3 className="mt-3">John Doe</h3>
                                    <p className="text-small">Junior Software Engineer</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-8">
                        <div className="card">
                            <div className="card-body">
                                <form action="#" method="get">
                                    <div className="form-group">
                                        <label htmlFor="name" className="form-label">Name</label>
                                        <input type="text" name="name" id="name" className="form-control" placeholder="Your Name" defaultValue="John Doe" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input type="text" name="email" id="email" className="form-control" placeholder="Your Email" defaultValue="john.doe@example.net" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="phone" className="form-label">Phone</label>
                                        <input type="text" name="phone" id="phone" className="form-control" placeholder="Your Phone" defaultValue="083xxxxxxxxx" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="birthday" className="form-label">Birthday</label>
                                        <input type="date" name="birthday" id="birthday" className="form-control" placeholder="Your Birthday" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="gender" className="form-label">Gender</label>
                                        <select name="gender" id="gender" className="form-control">
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                        </select>
                                    </div>
                                    <div className="form-group justify-self-center">
                                        <button type="submit" className="btn btn-primary">Save Changes</button>
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
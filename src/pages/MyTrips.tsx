import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

interface Trip {
    tripId: number;
    tripName: string;
    startDate: string;
    endDate: string;
}

function MyTrips() {

    const navigate = useNavigate();

    const [trips, setTrips] =
        useState<Trip[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [tripName, setTripName] =
        useState("");

    const [startDate, setStartDate] =
        useState("");

    const [endDate, setEndDate] =
        useState("");

    const fetchTrips = async () => {

        try {

            const response =
                await api.get("/trips");

            setTrips(response.data);

        } catch (error) {

            console.error(error);
        }
    };

    useEffect(() => {

        const initialize = async () => {

            try {

                await fetchTrips();

            } finally {

                setLoading(false);
            }
        };

        initialize();

    }, []);

    const addTrip = async () => {

        try {

            await api.post(
                "/trips",
                {
                    tripName,
                    startDate,
                    endDate
                }
            );

            setTripName("");
            setStartDate("");
            setEndDate("");

            await fetchTrips();

        } catch (error) {

            console.error(error);
        }
    };

    const deleteTrip = async (
        tripId: number
    ) => {

        if (
            !window.confirm(
                "Delete trip?"
            )
        ) {
            return;
        }

        try {

            await api.delete(
                `/trips/${tripId}`
            );

            await fetchTrips();

        } catch (error) {

            console.error(error);
        }
    };

    if (loading) {

        return (
            <div className="page-container text-center">

                <div
                    className="spinner-border"
                ></div>

            </div>
        );
    }

    return (
        <div className="page-container">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2>My Trips</h2>

                <button
                    className="btn btn-travel"
                    data-bs-toggle="modal"
                    data-bs-target="#addTripModal"
                >
                    + Add Trip
                </button>

            </div>

            {trips.length === 0 ? (
                <div className="alert alert-info">
                    No trips created yet.
                </div>
            ) : (
                trips.map((trip) => (
                    <div
                        className="trip-card"
                        key={trip.tripId}
                    >
                        <h4>{trip.tripName}</h4>

                        <p>
                            {trip.startDate} - {trip.endDate}
                        </p>

                        <button
                            className="btn btn-travel me-2"
                            onClick={() =>
                                navigate(
                                    `/tripdays/${trip.tripId}`
                                )
                            }
                        >
                            Days
                        </button>

                        <button
                            className="btn btn-warning me-2"
                        >
                            Edit
                        </button>

                        <button
                            className="btn btn-danger"
                            onClick={() =>
                                deleteTrip(trip.tripId)
                            }
                        >
                            Delete
                        </button>
                    </div>
                ))
            )}

            {/* Modal */}

            <div
                className="modal fade"
                id="addTripModal"
                tabIndex={-1}
            >
                <div className="modal-dialog">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h5>Add Trip</h5>
                        </div>

                        <div className="modal-body">

                            <input
                                className="form-control mb-3"
                                placeholder="Trip Name"
                                value={tripName}
                                onChange={(e) =>
                                    setTripName(
                                        e.target.value
                                    )
                                }
                            />

                            <input
                                className="form-control mb-3"
                                type="date"
                                value={startDate}
                                onChange={(e) =>
                                    setStartDate(
                                        e.target.value
                                    )
                                }
                            />

                            <input
                                className="form-control"
                                type="date"
                                value={endDate}
                                onChange={(e) =>
                                    setEndDate(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        <div className="modal-footer">

                            <button
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                            >
                                Close
                            </button>

                            <button
                                className="btn btn-travel"
                                onClick={addTrip}
                            >
                                Save
                            </button>

                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
}

export default MyTrips;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import apiClient from '../api/apiClient';

const BookingPage = () => {
    const { flightId } = useParams();
    const navigate = useNavigate();
    const [flight, setFlight] = useState(null);
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [passengers, setPassengers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const flightRes = await apiClient.get(`/flights/${flightId}`);
                setFlight(flightRes.data);

                const seatsRes = await apiClient.get(`/flights/${flightId}/seats`);
                setSeats(seatsRes.data);
            } catch (err) {
                setError('Failed to load flight data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [flightId]);

    const handleSeatSelect = (seatId, seatNumber) => {
        if (selectedSeats.includes(seatId)) {
            setSelectedSeats(selectedSeats.filter(id => id !== seatId));
            setPassengers(passengers.filter((_, i) => i !== selectedSeats.indexOf(seatId)));
        } else {
            setSelectedSeats([...selectedSeats, seatId]);
            setPassengers([...passengers, { name: '', email: '' }]);
        }
    };

    const handlePassengerChange = (index, field, value) => {
        const newPassengers = [...passengers];
        newPassengers[index][field] = value;
        setPassengers(newPassengers);
    };

    const handleConfirmBooking = async () => {
        setSubmitting(true);
        try {
            const response = await apiClient.post('/bookings', {
                flight_id: parseInt(flightId),
                seats: selectedSeats,
                passengers
            });

            navigate(`/payment/${response.data.booking.id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="text-center py-5"><Spinner animation="border" /></div>;

    return (
        <Container className="py-5">
            <Row>
                <Col lg={7}>
                    <h3 className="mb-4 fw-bold">Select Seats</h3>
                    {error && <Alert variant="danger">{error}</Alert>}

                    <div className="seat-grid mb-5">
                        {seats.map(seat => (
                            <Button
                                key={seat.id}
                                variant={selectedSeats.includes(seat.id) ? 'primary' : (seat.is_available ? 'light' : 'secondary')}
                                disabled={!seat.is_available}
                                onClick={() => handleSeatSelect(seat.id, seat.seat_number)}
                                className="m-1"
                            >
                                {seat.seat_number}
                            </Button>
                        ))}
                    </div>

                    <h4 className="mb-3 fw-bold">Passenger Information</h4>
                    {passengers.map((passenger, index) => (
                        <Card key={index} className="mb-3 p-3">
                            <h6>Seat {selectedSeats[index]}: Passenger {index + 1}</h6>
                            <Form.Group className="mb-3">
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={passenger.name}
                                    onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={passenger.email}
                                    onChange={(e) => handlePassengerChange(index, 'email', e.target.value)}
                                    required
                                />
                            </Form.Group>
                        </Card>
                    ))}
                </Col>

                <Col lg={5}>
                    <Card className="sticky-top" style={{ top: '20px' }}>
                        <Card.Body>
                            <h5 className="mb-3 fw-bold">Booking Summary</h5>
                            {flight && (
                                <>
                                    <p><strong>{flight.flight_number}</strong></p>
                                    <p className="small text-muted mb-3">{flight.airline_name}</p>
                                    <hr />
                                    <p>Passengers: {selectedSeats.length}</p>
                                    <p>Price per seat: ${flight.base_price}</p>
                                    <p className="h5 text-success fw-bold">
                                        Total: ${(flight.base_price * selectedSeats.length).toFixed(2)}
                                    </p>
                                    <Button 
                                        className="w-100 mt-3" 
                                        onClick={handleConfirmBooking}
                                        disabled={submitting || selectedSeats.length === 0}
                                    >
                                        {submitting ? 'Confirming...' : 'Continue to Payment'}
                                    </Button>
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default BookingPage;
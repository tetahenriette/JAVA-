import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { format } from 'date-fns';
import apiClient from '../api/apiClient';

const MyBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await apiClient.get('/bookings');
                setBookings(response.data);
            } catch (err) {
                setError('Failed to load bookings');
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const handleCancel = async (bookingId) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            try {
                await apiClient.delete(`/bookings/${bookingId}`);
                setBookings(bookings.filter(b => b.id !== bookingId));
            } catch (err) {
                setError('Failed to cancel booking');
            }
        }
    };

    if (loading) return <div className="text-center py-5"><Spinner animation="border" /></div>;

    return (
        <Container className="py-5">
            <h2 className="mb-4 fw-bold">My Bookings</h2>

            {error && <Alert variant="danger">{error}</Alert>}
            {bookings.length === 0 && <Alert variant="info">No bookings found</Alert>}

            <Row>
                {bookings.map(booking => (
                    <Col md={6} lg={4} key={booking.id} className="mb-4">
                        <Card className="shadow-sm h-100">
                            <Card.Body>
                                <h6 className="fw-bold mb-2">{booking.flight_number}</h6>
                                <p className="small text-muted mb-3">{booking.airline_name}</p>
                                <p className="mb-2">
                                    <strong>{booking.departure_airport}</strong> → <strong>{booking.arrival_airport}</strong>
                                </p>
                                <p className="small text-muted mb-3">
                                    {format(new Date(booking.departure_time), 'MMM dd, yyyy HH:mm')}
                                </p>
                                <hr />
                                <p className="mb-2">Reference: <strong>{booking.booking_reference}</strong></p>
                                <p className="h5 text-success fw-bold mb-3">${booking.total_price}</p>
                                <p className="mb-3">
                                    <span className="badge bg-info">{booking.status}</span>
                                </p>
                                <Button 
                                    variant="danger" 
                                    size="sm" 
                                    className="w-100"
                                    onClick={() => handleCancel(booking.id)}
                                >
                                    Cancel Booking
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default MyBookingsPage;
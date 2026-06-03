import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { format } from 'date-fns';
import apiClient from '../api/apiClient';

const SearchResultsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const searchFlights = async () => {
            try {
                const params = new URLSearchParams(location.search);
                const response = await apiClient.get('/flights/search', { params });
                setFlights(response.data);
            } catch (err) {
                setError('Failed to search flights');
            } finally {
                setLoading(false);
            }
        };

        searchFlights();
    }, [location.search]);

    const handleBooking = (flightId) => {
        navigate(`/booking/${flightId}`);
    };

    return (
        <Container className="py-5">
            <h2 className="mb-4 fw-bold">Search Results</h2>

            {error && <Alert variant="danger">{error}</Alert>}
            {loading && <div className="text-center"><Spinner animation="border" /></div>}

            {!loading && flights.length === 0 && (
                <Alert variant="info">No flights found. Try different search criteria.</Alert>
            )}

            <div className="space-y-3">
                {flights.map(flight => (
                    <Card key={flight.id} className="mb-3 shadow-sm">
                        <Card.Body>
                            <Row className="align-items-center">
                                <Col md={2}>
                                    <h6 className="fw-bold">{flight.flight_number}</h6>
                                    <p className="text-muted small">{flight.airline_name}</p>
                                </Col>
                                <Col md={3}>
                                    <p className="mb-1"><strong>{flight.departure_airport}</strong></p>
                                    <p className="text-muted small">{format(new Date(flight.departure_time), 'HH:mm')}</p>
                                </Col>
                                <Col md={2} className="text-center">
                                    <p className="text-muted">→</p>
                                    <p className="small text-muted">~5h</p>
                                </Col>
                                <Col md={3}>
                                    <p className="mb-1"><strong>{flight.arrival_airport}</strong></p>
                                    <p className="text-muted small">{format(new Date(flight.arrival_time), 'HH:mm')}</p>
                                </Col>
                                <Col md={2}>
                                    <h5 className="text-success fw-bold">${flight.base_price}</h5>
                                    <Button 
                                        size="sm" 
                                        onClick={() => handleBooking(flight.id)}
                                    >
                                        Book Now
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                ))}
            </div>
        </Container>
    );
};

export default SearchResultsPage;
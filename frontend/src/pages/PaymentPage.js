import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import apiClient from '../api/apiClient';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const PaymentForm = ({ bookingId, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
        const initPayment = async () => {
            try {
                const response = await apiClient.post('/payments/create-intent', {
                    booking_id: bookingId,
                    amount: 500 // Replace with actual booking amount
                });
                setClientSecret(response.data.clientSecret);
            } catch (err) {
                setError('Failed to initialize payment');
            }
        };
        initPayment();
    }, [bookingId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {}
                }
            });

            if (result.paymentIntent.status === 'succeeded') {
                onSuccess();
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}
            <CardElement />
            <Button 
                className="w-100 mt-3" 
                type="submit" 
                disabled={!stripe || loading}
            >
                {loading ? 'Processing...' : 'Pay Now'}
            </Button>
        </form>
    );
};

const PaymentPage = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(null);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const response = await apiClient.get(`/bookings/${bookingId}`);
                setBooking(response.data.booking);
            } catch (err) {
                console.error('Failed to fetch booking');
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [bookingId]);

    const handlePaymentSuccess = async () => {
        await apiClient.post('/payments/confirm', {
            booking_id: bookingId,
            paymentIntentId: 'intent_id' // Get from Stripe response
        });
        navigate('/my-bookings');
    };

    if (loading) return <div className="text-center py-5"><Spinner animation="border" /></div>;

    return (
        <Container className="py-5">
            <Row>
                <Col md={8} className="mx-auto">
                    <Card className="shadow-lg">
                        <Card.Body className="p-5">
                            <h3 className="mb-4 fw-bold">Payment</h3>
                            {booking && (
                                <>
                                    <p className="mb-3">Booking Reference: <strong>{booking.booking_reference}</strong></p>
                                    <h5 className="text-success mb-4">Total: ${booking.total_price}</h5>
                                    <Elements stripe={stripePromise}>
                                        <PaymentForm bookingId={bookingId} onSuccess={handlePaymentSuccess} />
                                    </Elements>
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default PaymentPage;